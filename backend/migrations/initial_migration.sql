-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_gradebox]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
--
-- NAMING CONVENTION (CRITICAL):
-- Use camelCase for ALL column names to align with JavaScript/TypeScript frontend
-- CORRECT: [studentName], [gradeValue], [createdAt]
-- WRONG: [student_name], [grade_value], [created_at]
-- Exception: [id] is always lowercase
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

/**
 * @table {grade} Student grade records
 * @multitenancy true
 * @softDelete false
 * @alias grd
 */
CREATE TABLE [dbo].[grade] (
  [id] INT IDENTITY(1,1) NOT NULL,
  [idAccount] INT NOT NULL,
  [studentName] NVARCHAR(100) NOT NULL,
  [subject] NVARCHAR(50) NOT NULL,
  [gradeValue] NUMERIC(3,1) NOT NULL,
  [observation] NVARCHAR(200) NULL,
  [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [updatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- =====================================================
-- PRIMARY KEYS
-- =====================================================

/**
 * @primaryKey {pkGrade}
 * @keyType Object
 */
ALTER TABLE [dbo].[grade]
ADD CONSTRAINT [pkGrade] PRIMARY KEY CLUSTERED ([id]);
GO

-- =====================================================
-- CHECK CONSTRAINTS
-- =====================================================

/**
 * @check {chkGrade_GradeValue} Grade value must be between 0.0 and 10.0
 */
ALTER TABLE [dbo].[grade]
ADD CONSTRAINT [chkGrade_GradeValue] CHECK ([gradeValue] >= 0.0 AND [gradeValue] <= 10.0);
GO

-- =====================================================
-- INDEXES
-- =====================================================

/**
 * @index {ixGrade_Account} Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account]
ON [dbo].[grade]([idAccount]);
GO

/**
 * @index {ixGrade_Account_Subject} Subject filtering index
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account_Subject]
ON [dbo].[grade]([idAccount], [subject])
INCLUDE ([studentName], [gradeValue]);
GO

/**
 * @index {ixGrade_Account_StudentName} Student name search index
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account_StudentName]
ON [dbo].[grade]([idAccount], [studentName])
INCLUDE ([subject], [gradeValue]);
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

/**
 * @summary
 * Creates a new grade record for a student.
 * Validates all input parameters and ensures grade value is within valid range.
 *
 * @procedure spGradeCreate
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/grade
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: Yes
 *   - Description: Full name of the student
 *
 * @param {NVARCHAR(50)} subject
 *   - Required: Yes
 *   - Description: Subject or discipline name
 *
 * @param {NUMERIC(3,1)} gradeValue
 *   - Required: Yes
 *   - Description: Grade value between 0.0 and 10.0
 *
 * @param {NVARCHAR(200)} observation
 *   - Required: No
 *   - Description: Additional observations about the grade
 *
 * @returns {INT} id - Created grade identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional observation
 * - Validation failure for missing required parameters
 * - Validation failure for grade value out of range
 * - Validation failure for invalid string lengths
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeCreate]
  @idAccount INT,
  @idUser INT,
  @studentName NVARCHAR(100),
  @subject NVARCHAR(50),
  @gradeValue NUMERIC(3,1),
  @observation NVARCHAR(200) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {studentNameRequired}
   */
  IF (@studentName IS NULL OR LEN(LTRIM(RTRIM(@studentName))) = 0)
  BEGIN
    ;THROW 51000, 'studentNameRequired', 1;
  END;

  /**
   * @validation String length validation
   * @throw {studentNameMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@studentName))) < 3)
  BEGIN
    ;THROW 51000, 'studentNameMinLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {subjectRequired}
   */
  IF (@subject IS NULL OR LEN(LTRIM(RTRIM(@subject))) = 0)
  BEGIN
    ;THROW 51000, 'subjectRequired', 1;
  END;

  /**
   * @validation String length validation
   * @throw {subjectMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@subject))) < 2)
  BEGIN
    ;THROW 51000, 'subjectMinLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {gradeValueRequired}
   */
  IF (@gradeValue IS NULL)
  BEGIN
    ;THROW 51000, 'gradeValueRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {gradeValueMinimum}
   */
  IF (@gradeValue < 0.0)
  BEGIN
    ;THROW 51000, 'gradeValueMinimum', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {gradeValueMaximum}
   */
  IF (@gradeValue > 10.0)
  BEGIN
    ;THROW 51000, 'gradeValueMaximum', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

    /**
     * @rule {db-grade-create} Insert new grade record
     */
    INSERT INTO [dbo].[grade] (
      [idAccount],
      [studentName],
      [subject],
      [gradeValue],
      [observation],
      [createdAt],
      [updatedAt]
    )
    VALUES (
      @idAccount,
      LTRIM(RTRIM(@studentName)),
      LTRIM(RTRIM(@subject)),
      @gradeValue,
      CASE WHEN @observation IS NOT NULL THEN LTRIM(RTRIM(@observation)) ELSE NULL END,
      GETUTCDATE(),
      GETUTCDATE()
    );

    /**
     * @output {GradeCreateResult, 1, 1}
     * @column {INT} id
     * - Description: Created grade identifier
     */
    SELECT SCOPE_IDENTITY() AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Retrieves a specific grade record by ID.
 * Returns complete grade information including all fields.
 *
 * @procedure spGradeGet
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier
 *
 * @testScenarios
 * - Valid retrieval with existing grade ID
 * - Not found error for non-existent grade ID
 * - Security validation for different account
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeGet]
  @idAccount INT,
  @id INT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {gradeNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[grade] [grd]
    WHERE [grd].[id] = @id
      AND [grd].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'gradeNotFound', 1;
  END;

  /**
   * @output {GradeDetail, 1, n}
   * @column {INT} id - Grade identifier
   * @column {NVARCHAR(100)} studentName - Student name
   * @column {NVARCHAR(50)} subject - Subject name
   * @column {NUMERIC(3,1)} gradeValue - Grade value
   * @column {NVARCHAR(200)} observation - Observations
   * @column {DATETIME2} createdAt - Creation timestamp
   * @column {DATETIME2} updatedAt - Last update timestamp
   */
  SELECT
    [grd].[id],
    [grd].[studentName],
    [grd].[subject],
    [grd].[gradeValue],
    [grd].[observation],
    [grd].[createdAt],
    [grd].[updatedAt]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[id] = @id
    AND [grd].[idAccount] = @idAccount;
END;
GO

/**
 * @summary
 * Lists all grades with optional filtering and sorting.
 * Supports filtering by student name, subject, and grade value range.
 *
 * @procedure spGradeList
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: No
 *   - Description: Filter by student name (partial match)
 *
 * @param {NVARCHAR(50)} subject
 *   - Required: No
 *   - Description: Filter by subject (partial match)
 *
 * @param {NUMERIC(3,1)} minGrade
 *   - Required: No
 *   - Description: Minimum grade value filter
 *
 * @param {NUMERIC(3,1)} maxGrade
 *   - Required: No
 *   - Description: Maximum grade value filter
 *
 * @param {NVARCHAR(20)} sortBy
 *   - Required: No
 *   - Description: Sort field (studentName, subject, gradeValue, createdAt)
 *
 * @param {NVARCHAR(4)} sortDirection
 *   - Required: No
 *   - Description: Sort direction (asc, desc)
 *
 * @testScenarios
 * - List all grades without filters
 * - Filter by student name
 * - Filter by subject
 * - Filter by grade value range
 * - Combined filters
 * - Different sort options
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeList]
  @idAccount INT,
  @studentName NVARCHAR(100) = NULL,
  @subject NVARCHAR(50) = NULL,
  @minGrade NUMERIC(3,1) = NULL,
  @maxGrade NUMERIC(3,1) = NULL,
  @sortBy NVARCHAR(20) = 'createdAt',
  @sortDirection NVARCHAR(4) = 'desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {invalidSortBy}
   */
  IF (@sortBy NOT IN ('studentName', 'subject', 'gradeValue', 'createdAt'))
  BEGIN
    SET @sortBy = 'createdAt';
  END;

  /**
   * @validation Business rule validation
   * @throw {invalidSortDirection}
   */
  IF (@sortDirection NOT IN ('asc', 'desc'))
  BEGIN
    SET @sortDirection = 'desc';
  END;

  /**
   * @output {GradeList, n, n}
   * @column {INT} id - Grade identifier
   * @column {NVARCHAR(100)} studentName - Student name
   * @column {NVARCHAR(50)} subject - Subject name
   * @column {NUMERIC(3,1)} gradeValue - Grade value
   * @column {NVARCHAR(200)} observation - Observations
   * @column {DATETIME2} createdAt - Creation timestamp
   * @column {DATETIME2} updatedAt - Last update timestamp
   */
  SELECT
    [grd].[id],
    [grd].[studentName],
    [grd].[subject],
    [grd].[gradeValue],
    [grd].[observation],
    [grd].[createdAt],
    [grd].[updatedAt]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
    AND (@studentName IS NULL OR [grd].[studentName] LIKE '%' + @studentName + '%')
    AND (@subject IS NULL OR [grd].[subject] LIKE '%' + @subject + '%')
    AND (@minGrade IS NULL OR [grd].[gradeValue] >= @minGrade)
    AND (@maxGrade IS NULL OR [grd].[gradeValue] <= @maxGrade)
  ORDER BY
    CASE WHEN @sortBy = 'studentName' AND @sortDirection = 'asc' THEN [grd].[studentName] END ASC,
    CASE WHEN @sortBy = 'studentName' AND @sortDirection = 'desc' THEN [grd].[studentName] END DESC,
    CASE WHEN @sortBy = 'subject' AND @sortDirection = 'asc' THEN [grd].[subject] END ASC,
    CASE WHEN @sortBy = 'subject' AND @sortDirection = 'desc' THEN [grd].[subject] END DESC,
    CASE WHEN @sortBy = 'gradeValue' AND @sortDirection = 'asc' THEN [grd].[gradeValue] END ASC,
    CASE WHEN @sortBy = 'gradeValue' AND @sortDirection = 'desc' THEN [grd].[gradeValue] END DESC,
    CASE WHEN @sortBy = 'createdAt' AND @sortDirection = 'asc' THEN [grd].[createdAt] END ASC,
    CASE WHEN @sortBy = 'createdAt' AND @sortDirection = 'desc' THEN [grd].[createdAt] END DESC;
END;
GO

/**
 * @summary
 * Updates an existing grade record.
 * Validates all input parameters and updates the updatedAt timestamp.
 *
 * @procedure spGradeUpdate
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: Yes
 *   - Description: Updated student name
 *
 * @param {NVARCHAR(50)} subject
 *   - Required: Yes
 *   - Description: Updated subject name
 *
 * @param {NUMERIC(3,1)} gradeValue
 *   - Required: Yes
 *   - Description: Updated grade value
 *
 * @param {NVARCHAR(200)} observation
 *   - Required: No
 *   - Description: Updated observations
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Valid update with null observation
 * - Not found error for non-existent grade
 * - Validation failures for invalid parameters
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeUpdate]
  @idAccount INT,
  @idUser INT,
  @id INT,
  @studentName NVARCHAR(100),
  @subject NVARCHAR(50),
  @gradeValue NUMERIC(3,1),
  @observation NVARCHAR(200) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {gradeNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[grade] [grd]
    WHERE [grd].[id] = @id
      AND [grd].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'gradeNotFound', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {studentNameRequired}
   */
  IF (@studentName IS NULL OR LEN(LTRIM(RTRIM(@studentName))) = 0)
  BEGIN
    ;THROW 51000, 'studentNameRequired', 1;
  END;

  /**
   * @validation String length validation
   * @throw {studentNameMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@studentName))) < 3)
  BEGIN
    ;THROW 51000, 'studentNameMinLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {subjectRequired}
   */
  IF (@subject IS NULL OR LEN(LTRIM(RTRIM(@subject))) = 0)
  BEGIN
    ;THROW 51000, 'subjectRequired', 1;
  END;

  /**
   * @validation String length validation
   * @throw {subjectMinLength}
   */
  IF (LEN(LTRIM(RTRIM(@subject))) < 2)
  BEGIN
    ;THROW 51000, 'subjectMinLength', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {gradeValueRequired}
   */
  IF (@gradeValue IS NULL)
  BEGIN
    ;THROW 51000, 'gradeValueRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {gradeValueMinimum}
   */
  IF (@gradeValue < 0.0)
  BEGIN
    ;THROW 51000, 'gradeValueMinimum', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {gradeValueMaximum}
   */
  IF (@gradeValue > 10.0)
  BEGIN
    ;THROW 51000, 'gradeValueMaximum', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

    /**
     * @rule {db-grade-update} Update existing grade record
     */
    UPDATE [dbo].[grade]
    SET
      [studentName] = LTRIM(RTRIM(@studentName)),
      [subject] = LTRIM(RTRIM(@subject)),
      [gradeValue] = @gradeValue,
      [observation] = CASE WHEN @observation IS NOT NULL THEN LTRIM(RTRIM(@observation)) ELSE NULL END,
      [updatedAt] = GETUTCDATE()
    WHERE [id] = @id
      AND [idAccount] = @idAccount;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Deletes a grade record permanently.
 * This is a hard delete operation that cannot be undone.
 *
 * @procedure spGradeDelete
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier to delete
 *
 * @testScenarios
 * - Valid deletion of existing grade
 * - Not found error for non-existent grade
 * - Security validation for different account
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeDelete]
  @idAccount INT,
  @idUser INT,
  @id INT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {gradeNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[grade] [grd]
    WHERE [grd].[id] = @id
      AND [grd].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'gradeNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

    /**
     * @rule {db-grade-delete} Hard delete grade record
     */
    DELETE FROM [dbo].[grade]
    WHERE [id] = @id
      AND [idAccount] = @idAccount;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Retrieves all grades for a specific subject with statistics.
 * Returns individual grades and calculated statistics (average, count, min, max).
 *
 * @procedure spGradeListBySubject
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade/subject/:subject
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(50)} subject
 *   - Required: Yes
 *   - Description: Subject name to filter by
 *
 * @testScenarios
 * - Valid retrieval with existing subject
 * - Empty result for non-existent subject
 * - Statistics calculation verification
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeListBySubject]
  @idAccount INT,
  @subject NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {subjectRequired}
   */
  IF (@subject IS NULL OR LEN(LTRIM(RTRIM(@subject))) = 0)
  BEGIN
    ;THROW 51000, 'subjectRequired', 1;
  END;

  /**
   * @output {SubjectGrades, n, n}
   * @column {INT} id - Grade identifier
   * @column {NVARCHAR(100)} studentName - Student name
   * @column {NUMERIC(3,1)} gradeValue - Grade value
   * @column {NVARCHAR(200)} observation - Observations
   * @column {DATETIME2} createdAt - Creation timestamp
   */
  SELECT
    [grd].[id],
    [grd].[studentName],
    [grd].[gradeValue],
    [grd].[observation],
    [grd].[createdAt]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
    AND [grd].[subject] = @subject
  ORDER BY [grd].[createdAt] DESC;

  /**
   * @output {SubjectStatistics, 1, n}
   * @column {INT} totalGrades - Total number of grades
   * @column {NUMERIC(3,1)} averageGrade - Average grade value
   * @column {NUMERIC(3,1)} minGrade - Minimum grade value
   * @column {NUMERIC(3,1)} maxGrade - Maximum grade value
   */
  SELECT
    COUNT(*) AS [totalGrades],
    CASE WHEN COUNT(*) > 0 THEN CAST(AVG([grd].[gradeValue]) AS NUMERIC(3,1)) ELSE NULL END AS [averageGrade],
    CASE WHEN COUNT(*) > 0 THEN MIN([grd].[gradeValue]) ELSE NULL END AS [minGrade],
    CASE WHEN COUNT(*) > 0 THEN MAX([grd].[gradeValue]) ELSE NULL END AS [maxGrade]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
    AND [grd].[subject] = @subject;
END;
GO

/**
 * @summary
 * Retrieves overview statistics for all subjects.
 * Returns list of subjects with their respective statistics.
 *
 * @procedure spGradeSubjectOverview
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade/overview
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(20)} sortBy
 *   - Required: No
 *   - Description: Sort field (subject, totalGrades, averageGrade)
 *
 * @param {NVARCHAR(4)} sortDirection
 *   - Required: No
 *   - Description: Sort direction (asc, desc)
 *
 * @testScenarios
 * - Valid retrieval with default sorting
 * - Different sort options
 * - Empty result when no grades exist
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeSubjectOverview]
  @idAccount INT,
  @sortBy NVARCHAR(20) = 'subject',
  @sortDirection NVARCHAR(4) = 'asc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Business rule validation
   */
  IF (@sortBy NOT IN ('subject', 'totalGrades', 'averageGrade'))
  BEGIN
    SET @sortBy = 'subject';
  END;

  /**
   * @validation Business rule validation
   */
  IF (@sortDirection NOT IN ('asc', 'desc'))
  BEGIN
    SET @sortDirection = 'asc';
  END;

  /**
   * @output {SubjectOverview, n, n}
   * @column {NVARCHAR(50)} subject - Subject name
   * @column {INT} totalGrades - Total number of grades for subject
   * @column {NUMERIC(3,1)} averageGrade - Average grade for subject
   * @column {NUMERIC(3,1)} minGrade - Minimum grade for subject
   * @column {NUMERIC(3,1)} maxGrade - Maximum grade for subject
   */
  SELECT
    [grd].[subject],
    COUNT(*) AS [totalGrades],
    CAST(AVG([grd].[gradeValue]) AS NUMERIC(3,1)) AS [averageGrade],
    MIN([grd].[gradeValue]) AS [minGrade],
    MAX([grd].[gradeValue]) AS [maxGrade]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
  GROUP BY [grd].[subject]
  ORDER BY
    CASE WHEN @sortBy = 'subject' AND @sortDirection = 'asc' THEN [grd].[subject] END ASC,
    CASE WHEN @sortBy = 'subject' AND @sortDirection = 'desc' THEN [grd].[subject] END DESC,
    CASE WHEN @sortBy = 'totalGrades' AND @sortDirection = 'asc' THEN COUNT(*) END ASC,
    CASE WHEN @sortBy = 'totalGrades' AND @sortDirection = 'desc' THEN COUNT(*) END DESC,
    CASE WHEN @sortBy = 'averageGrade' AND @sortDirection = 'asc' THEN AVG([grd].[gradeValue]) END ASC,
    CASE WHEN @sortBy = 'averageGrade' AND @sortDirection = 'desc' THEN AVG([grd].[gradeValue]) END DESC;
END;
GO
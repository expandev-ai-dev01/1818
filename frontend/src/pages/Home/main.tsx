/**
 * @page HomePage
 * @summary Home page with welcome message and navigation
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao GradeBox</h2>
      <p className="text-xl text-gray-600 mb-8">
        Sistema minimalista para gerenciamento de notas de alunos
      </p>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Funcionalidades</h3>
          <ul className="text-left space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Registrar notas de alunos por matéria</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Consultar notas de forma rápida e simples</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Atualizar e gerenciar informações dos alunos</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Interface minimalista e intuitiva</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

# GradeBox - Sistema de Gerenciamento de Notas

O GradeBox é um sistema minimalista para registrar e consultar notas de alunos. Ele permite armazenar no banco de dados informações básicas como nome do aluno, matéria e nota, e depois visualizar essas notas de forma simples e rápida.

## Tecnologias

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router DOM 7.9.3
- TanStack Query 5.90.2
- Axios 1.12.2
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   └── router.tsx         # Configuração de rotas
├── assets/                # Recursos estáticos
│   └── styles/           # Estilos globais
├── core/                  # Componentes e utilitários compartilhados
│   ├── components/       # Componentes genéricos
│   ├── lib/             # Configurações de bibliotecas
│   └── utils/           # Funções utilitárias
├── domain/               # Módulos de domínio
├── pages/                # Páginas da aplicação
│   └── layouts/         # Layouts compartilhados
└── main.tsx             # Ponto de entrada
```

## Funcionalidades

- ✓ Registrar notas de alunos por matéria
- ✓ Consultar notas de forma rápida e simples
- ✓ Atualizar e gerenciar informações dos alunos
- ✓ Interface minimalista e intuitiva

## Licença

MIT
# Caring with Love

**Site de cuidados especializados para idosos** – landing page informativa para clientes interessados em serviços de acompanhamento, suporte médico, fisioterapia e bem-estar para seus familiares idosos.

## Visão Geral

A **Caring with Love** é uma página web completa que apresenta:

- **Hero section** com chamada de ação clara
- **Estatísticas** de experiência e satisfação dos clientes
- **Serviços** detalhados (cuidado domiciliar, suporte médico, estimulação cognitiva, companhia, fisioterapia e cuidado noturno)
- **Sobre nós** com valores e missão da empresa
- **Por que nos escolher** – diferenciais competitivos
- **Equipe** de profissionais especializados
- **Depoimentos** de clientes satisfeitos
- **Planos** (Básico, Completo e Integral)
- **Formulário de contato** com validação
- **Rodapé** com informações de contato e navegação

## Estrutura do Projeto

```
Caring-with-Love/
├── index.html        # Página principal (landing page)
├── css/
│   └── styles.css    # Estilos (design responsivo, paleta acolhedora)
├── js/
│   └── main.js       # Interatividade (menu mobile, validação de formulário, animações)
└── README.md
```

## Tecnologias

- **HTML5** semântico e acessível (ARIA)
- **CSS3** responsivo com variáveis CSS (sem framework externo)
- **JavaScript** puro (sem dependências)
- Fontes: [Lora](https://fonts.google.com/specimen/Lora) + [Open Sans](https://fonts.google.com/specimen/Open+Sans) via Google Fonts

## Como Usar

1. Clone o repositório
2. Abra `index.html` no navegador – nenhum servidor ou build é necessário

```bash
git clone https://github.com/Alfredoprogramador/Caring-with-Love.git
cd Caring-with-Love
# Abra index.html no seu navegador preferido
```

## Funcionalidades

- ✅ Design **responsivo** (mobile, tablet e desktop)
- ✅ Menu de navegação **mobile** com animação
- ✅ **Scroll suave** para seções
- ✅ Destaque de link ativo conforme a seção visível
- ✅ **Formulário de contato** com validação de campos
- ✅ **Animações** de entrada dos cards (Intersection Observer)
- ✅ Botão **"Voltar ao topo"**
- ✅ Acessibilidade (ARIA labels, foco visível, semântica)
- ✅ Respeita preferência `prefers-reduced-motion`

## Personalização

Edite as variáveis CSS no topo de `css/styles.css` para ajustar cores, tipografia e espaçamentos. Atualize os textos, telefone, e-mail e endereço diretamente no `index.html`.

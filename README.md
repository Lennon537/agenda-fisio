# Ketllen Souza Fisioterapia & Pilates 🌿

Sistema moderno e completo de agendamento de sessões, fila de encaixe inteligente ("stand-by" com triagem de nível de dor), painel administrativo exclusivo da Dra. Ketllen Souza, prontuário eletrônico com prescrição de exercícios domiciliares e integração gratuita com Google Agenda.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lennon537/agenda-fisio)

---

## ✨ Principais Funcionalidades

### 1. Espaço do Paciente
* **Agendamento em 3 Passos**:
  1. Escolha do cuidado (*Fisioterapia* individual ou *Pilates*).
  2. Seleção de data via calendário mensal interativo.
  3. Escolha de horários divididos em *Manhã* e *Tarde* em grid de 3 colunas.
* **Solicitação de Encaixe Inteligente**: Formulário com termômetro de dor (0 a 10) e seleção de turnos preferidos.
* **Google Agenda (100% Gratuito)**: Botão de 1 clique para adicionar a consulta ao Google Agenda sem custo de API.
* **Minhas Orientações & Exercícios para Casa**: Paciente acessa os exercícios e recomendações prescritos pela Dra. Ketllen diretamente na sua tela de sessões.
* **Acesso Responsivo Nativo**: Layout desktop com menu lateral e versão mobile com *Bottom Navigation Bar* de 3 abas fiel a aplicativo de celular.
* **Modo Escuro & Modo Claro**: Alternância de tema com persistência automática no navegador.

### 2. Painel Clínico & Gestão da Dra. Ketllen
* **Agenda da Clínica**: Visualização de atendimentos com filtros por especialidade, conclusão de sessões e histórico.
* **Lembretes via WhatsApp**: Disparo de mensagens pré-formatadas de lembrete de consulta de 24h e 2h antes.
* **Gestão de Encaixes & Triagem de Dor**: Fila de espera com alerta visual por gravidade da dor (0 a 10) e botão *"Aprovar & Inserir na Agenda"*, que aloca o horário e abre mensagem de confirmação para o paciente.
* **Prontuário Eletrônico**:
  * Anamnese, queixa principal e diagnóstico cinesiológico.
  * Histórico de evoluções com conduta e registro de dor pós-sessão.
  * Prescrição de exercícios domiciliares que sincronizam no app do paciente.

---

## 🚀 Como Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ☁️ Publicação na Vercel

O projeto está 100% compatível com a Vercel e o Next.js 15:

1. Acesse [vercel.com](https://vercel.com).
2. Clique em **"Add New..."** > **"Project"**.
3. Importe o repositório: **`Lennon537/agenda-fisio`**.
4. Clique em **"Deploy"**!

---

© 2026 Ketllen Souza Fisioterapia. Cuidado em cada movimento.

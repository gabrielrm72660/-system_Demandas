
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Auth } from './components/Auth.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { DemandForm } from './components/DemandForm.tsx';
import { DemandTable } from './components/DemandTable.tsx';
import { FinancialModal } from './components/FinancialModal.tsx';
import { Settings } from './components/Settings.tsx';
import { Demanda, Usuario, Empresa, ItemCatalogo, StatusDemanda } from './types.ts';

const initialDemands: Demanda[] = [
  // PÁGINA 1
  { id: '44120', empresa: 'ProClima', nCitsmartSei: '44120', n4bisOsSei: 'SEI-44120', tipoServico: 'Mudança de Layout', descricao: 'Orçamento para novo layout do 2º andar ala Norte na SCDC. Cronograma de execução e projeto Marcelo Mariano.', solicitante: 'Kássio Alves Rocha', setor: 'SCDC', local: '2º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-04-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1711929600000 },
  { id: '44551', empresa: 'ProClima', nCitsmartSei: '44551', n4bisOsSei: 'SEI-44551', tipoServico: 'Divisória', descricao: 'Instalação de parede divisória na sala SS19. Material da sala da Costureira.', solicitante: 'Marcelo Fernandes Mariano', setor: 'SS19', local: 'Subsolo', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-06-01', dataConclusao: '', mesFaturamento: '', status: 'Em Execução', anexos: [], itensFinanceiros: [], createdAt: 1717113600000 },
  { id: '43100', empresa: 'ProClima', nCitsmartSei: '43100', n4bisOsSei: 'SEI-43100', tipoServico: 'Ar-condicionado', descricao: 'Vistorias para levantamento de necessidades dos ares condicionados do 1º pavimento.', solicitante: 'Marcelo Fernandes Mariano', setor: 'ALA SUL', local: '1º Andar', responsavel: 'Vitória', dataSolicitacao: '2024-02-01', dataConclusao: '2024-02-20', mesFaturamento: 'Março / 2024', status: 'Concluída', anexos: [], itensFinanceiros: [], createdAt: 1706745600000 },
  { id: '45472', empresa: 'ProClima', nCitsmartSei: '45472', n4bisOsSei: 'SEI-45472', tipoServico: 'Hidrossanitário', descricao: 'Reparo no anel de vedação do vaso sanitário wc masculino ala norte. Infiltração.', solicitante: 'Gabriel Ricarte', setor: 'WC Masculino', local: '3º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-09-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '45561', empresa: 'ProClima', nCitsmartSei: '45561', n4bisOsSei: 'SEI-45561', tipoServico: 'Iluminação', descricao: 'Instalação de interruptor na nova sala do GAB/SCDC.', solicitante: 'José Adriano Carvalho', setor: 'GAB/SCDC', local: '2º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-09-01', dataConclusao: '2024-09-15', mesFaturamento: 'Outubro / 2024', status: 'Concluída', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '45619', empresa: 'ProClima', nCitsmartSei: '45619', n4bisOsSei: 'SEI-45619', tipoServico: 'Hidrossanitário', descricao: 'Desperdício de água na descarga e torneira vazando no banheiro feminino 3º andar.', solicitante: 'Kássio Alves Rocha', setor: 'WC Feminino', local: '3º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-09-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '45712', empresa: 'ProClima', nCitsmartSei: '45712', n4bisOsSei: 'SEI-45712', tipoServico: 'Rede Elétrica', descricao: 'Manutenção de tomadas em três estações da DSNC. Risco de curto-circuito.', solicitante: 'Moacir Wilson', setor: 'DSNC', local: '2º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-09-01', dataConclusao: '', mesFaturamento: '', status: 'Em Execução', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '45781', empresa: 'ProClima', nCitsmartSei: '45781', n4bisOsSei: 'SEI-45781', tipoServico: 'Mudança de Layout', descricao: 'Alteração de layout no gabinete da Ministra da Cultura. Planta de montagem em anexo.', solicitante: 'Ricardo Ruiz', setor: 'GM', local: '4º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-10-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1727740800000 },
  
  // PÁGINA 2
  { id: '45946', empresa: 'ProClima', nCitsmartSei: '45946', n4bisOsSei: 'SEI-45946', tipoServico: 'Rede Lógica', descricao: 'Instalação de ponto de rede para novo computador da ASCOM.', solicitante: 'Marina Maia', setor: 'ASCOM', local: '4º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-10-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1727740800000 },
  { id: '45964', empresa: 'ProClima', nCitsmartSei: '45964', n4bisOsSei: 'SEI-45964', tipoServico: 'Hidrossanitário', descricao: 'Substituição dos três assentos do WC masculino ala sul 3º andar.', solicitante: 'Gabriel Ricarte', setor: 'WC Masculino', local: '3º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-10-01', dataConclusao: '2024-10-25', mesFaturamento: '', status: 'Concluída', anexos: [], itensFinanceiros: [], createdAt: 1727740800000 },
  { id: '46034', empresa: 'ProClima', nCitsmartSei: '46034', n4bisOsSei: 'SEI-46034', tipoServico: 'Rede Elétrica', descricao: 'Verificar pipoco na tomada da sala de reunião 2º andar (TV).', solicitante: 'Gabriel Ricarte', setor: 'Sala de Reuniões', local: '2º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-10-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1727740800000 },
  { id: '45679', empresa: 'ProClima', nCitsmartSei: '45679', n4bisOsSei: 'SEI-45679', tipoServico: 'Ar-condicionado', descricao: 'Fornecimento e Instalação de equipamento tipo Split para a sala Subsecretaria SPOA.', solicitante: 'Vitória Oliveira', setor: 'SPOA', local: '3º Andar', responsavel: 'Vitória', dataSolicitacao: '2024-11-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1730419200000 },
  { id: '46380', empresa: 'ProClima', nCitsmartSei: '46380', n4bisOsSei: 'SEI-46380', tipoServico: 'Hidrossanitário', descricao: 'Revisão do sistema hidrossanitário: respiros e ralos para resolver mal cheiro.', solicitante: 'Clésio Mota', setor: 'WCs', local: '3º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-12-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1733011200000 },
  { id: '46534', empresa: 'ProClima', nCitsmartSei: '46534', n4bisOsSei: 'SEI-46534', tipoServico: 'Hidrossanitário', descricao: 'Serviço concluído! Instalação de mola aérea modelo UD77Z UDINESE.', solicitante: 'Clésio Mota', setor: 'WC', local: '3º Andar', responsavel: 'Gabriel Pin', dataSolicitacao: '2024-12-01', dataConclusao: '2024-12-15', mesFaturamento: 'Janeiro / 2025', status: 'Concluída', anexos: [], itensFinanceiros: [], createdAt: 1733011200000 },

  // PÁGINA 3 (CONTRATOS COND)
  { id: '45316', empresa: 'ProClima', nCitsmartSei: '45316', n4bisOsSei: 'COND-45316', tipoServico: 'Reparos', descricao: 'SUBSTITUIR CANCELA DE VIDRO QUE QUEBROU NA SAÍDA P13 - SUBSOLO', solicitante: 'Victor Hugo', setor: 'SAIDA P13', local: 'Subsolo', responsavel: 'Mariana', dataSolicitacao: '2024-08-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1722470400000 },
  { id: '45324', empresa: 'ProClima', nCitsmartSei: '45324', n4bisOsSei: 'COND-45324', tipoServico: 'Rede Elétrica', descricao: 'TROCAR DISJUNTOR NA CAIXA MOLDADA DO QUADRO ELÉTRICO DO RESTAURANTE', solicitante: 'Victor Hugo', setor: 'RESTAURANTE', local: 'Subsolo', responsavel: 'Mariana', dataSolicitacao: '2024-08-01', dataConclusao: '', mesFaturamento: '', status: 'Em Execução', anexos: [], itensFinanceiros: [], createdAt: 1722470400000 },
  { id: '45507', empresa: 'ProClima', nCitsmartSei: '45507', n4bisOsSei: 'COND-45507', tipoServico: 'Marcenaria', descricao: 'COLAR NOVAMENTE A CUBA QUE SE SOLTOU NA PIA DO DEPÓSITO', solicitante: 'Victor Hugo', setor: 'DEPOSITO', local: 'Subsolo', responsavel: 'Mariana', dataSolicitacao: '2024-09-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '46118', empresa: 'ProClima', nCitsmartSei: '46118', n4bisOsSei: 'COND-46118', tipoServico: 'Hidrossanitário', descricao: 'TROCA DE ASSENTO SANITARIO', solicitante: 'José Aryslan', setor: 'WC', local: 'Térreo', responsavel: 'Mariana', dataSolicitacao: '2024-11-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1730419200000 },
  { id: '45976', empresa: 'ProClima', nCitsmartSei: '45976', n4bisOsSei: 'COND-45976', tipoServico: 'Pintura', descricao: 'Solicitação de pintura conforme listagem de e-mail e orçamento.', solicitante: 'Ozil Oliveira', setor: 'RESTAURANTE', local: 'Subsolo', responsavel: 'Mariana', dataSolicitacao: '2024-10-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1727740800000 },
  { id: '46548', empresa: 'ProClima', nCitsmartSei: '46548', n4bisOsSei: 'CIMP-46548', tipoServico: 'Ar-condicionado', descricao: 'Instalação de Split 18 BTU no Rack do 2º Andar finalizada em 18/02/2025.', solicitante: 'Clésio Mota', setor: 'RACK', local: '2º Andar', responsavel: 'Vitória', dataSolicitacao: '2025-01-01', dataConclusao: '2025-02-18', mesFaturamento: '', status: 'Concluída', anexos: [], itensFinanceiros: [], createdAt: 1735689600000 },

  // PÁGINA 14-16 (AGOSTO/SETEMBRO)
  { id: '55874', empresa: 'ProClima', nCitsmartSei: '55874', n4bisOsSei: 'SEI-55874', tipoServico: 'Rede Lógica', descricao: 'Ponto de rede na CODIN Sala 04 apresentando falhas.', solicitante: 'Barbara Antunes', setor: 'CODIN', local: 'Térreo', responsavel: 'Clésio', dataSolicitacao: '2024-08-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1722470400000 },
  { id: '56132', empresa: 'JC Refrigeração', nCitsmartSei: '56132', n4bisOsSei: 'SEI-56132', tipoServico: 'Ar-condicionado', descricao: 'Limpeza prevista em contrato em 32 aparelhos de ar condicionado.', solicitante: 'João Rodrigues', setor: 'BDB', local: 'Térreo', responsavel: 'Mariana', dataSolicitacao: '2024-08-01', dataConclusao: '', mesFaturamento: '', status: 'Em Execução', anexos: [], itensFinanceiros: [], createdAt: 1722470400000 },
  { id: '62421', empresa: 'ProClima', nCitsmartSei: '62421', n4bisOsSei: 'CIMP-62421', tipoServico: 'Ar-condicionado', descricao: 'Diminuição da temperatura ar condicionado 12 no Grupo 01 Ala Norte.', solicitante: 'Roger Roque', setor: 'COGEP', local: '3º Andar', responsavel: 'Gabriel R', dataSolicitacao: '2024-09-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1725148800000 },
  { id: '69672', empresa: 'ProClima', nCitsmartSei: '69672', n4bisOsSei: 'SEI-69672', tipoServico: 'Hidrossanitário', descricao: 'Vazamento na cerâmica do chão do banheiro masculino. Necessário quebrar o piso.', solicitante: 'João Santos', setor: 'BDB', local: 'Térreo', responsavel: 'Clésio', dataSolicitacao: '2024-12-01', dataConclusao: '', mesFaturamento: '', status: 'Aberta', anexos: [], itensFinanceiros: [], createdAt: 1733011200000 }
];

const App: React.FC = () => {
  // --- Estados Persistentes ---
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('sgf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [demandas, setDemandas] = useState<Demanda[]>(() => {
    const saved = localStorage.getItem('sgf_demandas');
    return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialDemands;
  });

  const [empresas, setEmpresas] = useState<Empresa[]>(() => {
    const saved = localStorage.getItem('sgf_empresas');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'ProClima' }, 
      { id: '2', nome: 'Big Chaves' }, 
      { id: '3', nome: 'JC Refrigeração' },
      { id: '4', nome: 'Ferreira e Santos' },
      { id: '5', nome: 'CODAP' },
      { id: '6', nome: 'Estrella Luna' }
    ];
  });

  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>(() => {
    const saved = localStorage.getItem('sgf_catalogo');
    return saved ? JSON.parse(saved) : [
      { id: 'i8', nome: 'Item 8', valorUnitario: 150.00, unidade: 'H/H' },
      { id: 'i9', nome: 'Item 9', valorUnitario: 220.50, unidade: 'Un' },
      { id: 'i10', nome: 'Item 10', valorUnitario: 310.00, unidade: 'M2' },
      { id: 'i11', nome: 'Item 11', valorUnitario: 95.00, unidade: 'KM' }
    ];
  });

  const [users, setUsers] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('sgf_all_users');
    return saved ? JSON.parse(saved) : [{ username: 'admin', password: 'admin', role: 'ADMIN' }];
  });

  // Inicialização do tema baseada no localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const theme = localStorage.getItem('sgf_theme');
    return theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  // Sincronização do tema com o DOM e localStorage
  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sgf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sgf_theme', 'light');
    }
  }, [darkMode]);

  // Persistência de dados
  useEffect(() => {
    localStorage.setItem('sgf_demandas', JSON.stringify(demandas));
    localStorage.setItem('sgf_empresas', JSON.stringify(empresas));
    localStorage.setItem('sgf_catalogo', JSON.stringify(catalogo));
    localStorage.setItem('sgf_all_users', JSON.stringify(users));
  }, [demandas, empresas, catalogo, users]);

  // --- Handlers ---
  const handleLogin = (u: Usuario) => {
    setUser(u);
    localStorage.setItem('sgf_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sgf_user');
  };

  const saveDemanda = (d: Demanda) => {
    setDemandas(prev => {
      const index = prev.findIndex(item => item.id === d.id);
      if (index !== -1) {
        const newArr = [...prev];
        newArr[index] = d;
        return newArr;
      }
      return [d, ...prev];
    });
    setCurrentView('table');
  };

  const deleteDemanda = (id: string) => {
    if (user?.role !== 'ADMIN') return;
    setDemandas(prev => prev.filter(d => d.id !== id));
  };

  const updateStatus = (id: string, status: StatusDemanda) => {
    setDemandas(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleImport = (data: any) => {
    if (data.demandas) setDemandas(data.demandas);
    if (data.companies) setEmpresas(data.companies);
    if (data.catalog) setCatalogo(data.catalog);
    if (data.users) setUsers(data.users);
  };

  // --- Navegação ---
  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'form' | 'settings'>('dashboard');
  const [selectedDemandaFin, setSelectedDemandaFin] = useState<Demanda | null>(null);

  if (!user) return <Auth onLogin={handleLogin} users={users} />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard demandas={demandas} />}
          
          {currentView === 'table' && (
            <DemandTable 
              demandas={demandas} 
              onEdit={saveDemanda} 
              onFinancial={setSelectedDemandaFin}
              onDelete={deleteDemanda}
              onUpdateStatus={updateStatus}
              onImport={handleImport}
              user={user}
              companies={empresas}
              catalog={catalogo}
              users={users}
            />
          )}

          {currentView === 'form' && (
            <DemandForm 
              onSubmit={saveDemanda} 
              empresas={empresas} 
              onCancel={() => setCurrentView('table')} 
            />
          )}

          {currentView === 'settings' && user.role === 'ADMIN' && (
            <Settings 
              empresas={empresas} 
              setEmpresas={setEmpresas} 
              catalogo={catalogo} 
              setCatalogo={setCatalogo}
              users={users}
              setUsers={setUsers}
            />
          )}
        </div>
      </main>

      {selectedDemandaFin && (
        <FinancialModal 
          demanda={selectedDemandaFin}
          catalogo={catalogo}
          onClose={() => setSelectedDemandaFin(null)}
          onSave={(updated) => {
            saveDemanda(updated);
            setSelectedDemandaFin(null);
          }}
        />
      )}
    </div>
  );
};

export default App;

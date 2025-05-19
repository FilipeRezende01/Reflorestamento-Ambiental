document.addEventListener('DOMContentLoaded', function() {
    const formularioCadastro = document.getElementById('formularioCadastro');
    const selecaoAvatar = document.getElementById('selecaoAvatar');
    const opcoesAvatar = document.querySelectorAll('.avatar');
    const container = document.querySelector('.container');
    const secaoBemVindo = document.getElementById('secaoBemVindo');
    const formularioReflorestamento = document.getElementById('formularioReflorestamento');
    const formularioPlantio = document.getElementById('formularioPlantio');
    const voltarPainel = document.getElementById('voltarPainel');
    const secaoPerfil = document.getElementById('secaoPerfil');
    const voltarPainelDoPerfil = document.getElementById('voltarPainelDoPerfil');
    const secaoRelatorio = document.getElementById('secaoRelatorio');
    const formularioRelatorio = document.getElementById('formularioRelatorio');
    const voltarPainelDoRelatorio = document.getElementById('voltarPainelDoRelatorio');
    const resultadosRelatorio = document.getElementById('resultadosRelatorio');
    const secaoTopUsuarios = document.getElementById('secaoTopUsuarios');
    const containerTopUsuarios = document.getElementById('containerTopUsuarios');
    const linkReflorestamento = document.getElementById('linkReflorestamento');
    const linkPerfil = document.getElementById('linkPerfil');
    const linkRelatorio = document.getElementById('linkRelatorio');
    const linkDestaques = document.getElementById('linkDestaques');
    
    let avatarSelecionado = null;
    let usuarioAtual = null;

    const temasArvores = {
        'pau-brasil': { primaria: '#9a1f1a', secundaria: '#f9e6e6' },
        'castanheira': { primaria: '#8b4513', secundaria: '#f5ebe0' },
        'peroba-rosa': { primaria: '#d87093', secundaria: '#fce4ec' }
    };

    const imagensAvatar = {
        'pau-brasil': 'https://sitiomorrinhos.com.br/wp-content/uploads/2022/03/im-pau-brasil-1.jpeg',
        'castanheira': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4k0Q63lF7OnzEu_nnhRenk5W80wAyeA32_SAkveHt-Ywqmr_1kgdQpv9hKTOQdWeBpZiL4nYrouJ17kTOwh2lr8KMXJ1jOnwRopWYU6RjU6FDglR1vDbw7huexH3qUWlyt8XXpYJIHa2U/s1600/castanheira.JPG',
        'peroba-rosa': 'https://reinometaphyta.wordpress.com/wp-content/uploads/2012/06/aspidosperma_polyneuron_apocynaceae.jpg'
    };

    const imagensProgresso = {
        'plantada': 'https://img.myloview.com.br/quadros/mao-do-ser-humano-plantando-sementes-no-solo-700-153650078.jpg',
        'broto': 'https://img.freepik.com/fotos-premium/pequeno-broto-de-arvore-em-crescimento-close-up_271293-1200.jpg',
        'jovem': 'https://www.parquedasaves.com.br/wp-content/uploads/2019/09/guapeba.jpg',
        'madura': 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2022/01/tronco.jpg'
    };

    const usuarioSalvo = localStorage.getItem('dadosUsuario');
    if (usuarioSalvo) {
        usuarioAtual = JSON.parse(usuarioSalvo);
        mostrarSecaoBemVindo(usuarioAtual);
    } else {
        mostrarFormularioLogin();
    }

    formularioCadastro.addEventListener('submit', lidarComLogin);
    opcoesAvatar.forEach(avatar => avatar.addEventListener('click', selecionarAvatar));
    formularioPlantio.addEventListener('submit', registrarPlantio);
    voltarPainel.addEventListener('click', () => mostrarSecaoBemVindo(usuarioAtual));
    voltarPainelDoPerfil.addEventListener('click', () => mostrarSecaoBemVindo(usuarioAtual));
    voltarPainelDoRelatorio.addEventListener('click', () => mostrarSecaoBemVindo(usuarioAtual));
    document.getElementById('salvarBiografia').addEventListener('click', salvarBiografia);
    formularioRelatorio.addEventListener('submit', function(e) {
        e.preventDefault();
        gerarRelatorio();
    });
    
    linkReflorestamento.addEventListener('click', function(e) {
        e.preventDefault();
        if (usuarioAtual) {
            secaoBemVindo.style.display = 'none';
            formularioReflorestamento.style.display = 'block';
            secaoPerfil.style.display = 'none';
            secaoRelatorio.style.display = 'none';
            secaoTopUsuarios.style.display = 'none';
        }
    });

    linkPerfil.addEventListener('click', function(e) {
        e.preventDefault();
        if (usuarioAtual) {
            mostrarSecaoPerfil(usuarioAtual);
        }
    });

    linkRelatorio.addEventListener('click', function(e) {
        e.preventDefault();
        if (usuarioAtual) {
            secaoBemVindo.style.display = 'none';
            secaoRelatorio.style.display = 'block';
            secaoPerfil.style.display = 'none';
            formularioReflorestamento.style.display = 'none';
            secaoTopUsuarios.style.display = 'none';
            if (!localStorage.getItem('registrosPlantio')) {
                gerarDadosMockados();
            }
            gerarRelatorio();
        }
    });

    linkDestaques.addEventListener('click', function(e) {
        e.preventDefault();
        if (usuarioAtual) {
            secaoBemVindo.style.display = 'none';
            secaoTopUsuarios.style.display = 'block';
            secaoPerfil.style.display = 'none';
            formularioReflorestamento.style.display = 'none';
            secaoRelatorio.style.display = 'none';
            carregarTopUsuarios();
        }
    });

    function mostrarMenuNavegacao() {
        document.querySelector('.menu-navegacao').style.display = 'block';
    }

    function esconderMenuNavegacao() {
        document.querySelector('.menu-navegacao').style.display = 'none';
    }

    function lidarComLogin(event) {
        event.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        if (!usuario || !senha) return alert('Preencha usuário e senha!');
        if (senha.length < 6) return alert('Senha deve ter pelo menos 6 caracteres');

        formularioCadastro.style.display = 'none';
        selecaoAvatar.style.display = 'block';
    }

    function selecionarAvatar() {
        opcoesAvatar.forEach(avatar => avatar.classList.remove('selecionado'));
        this.classList.add('selecionado');
        avatarSelecionado = this;

        usuarioAtual = {
            username: document.getElementById('usuario').value,
            avatar: this.getAttribute('data-arvore'),
            ultimoLogin: new Date().toISOString(),
            bio: localStorage.getItem(`${document.getElementById('usuario').value}_bio`) || ''
        };

        localStorage.setItem('dadosUsuario', JSON.stringify(usuarioAtual));
        mostrarSecaoBemVindo(usuarioAtual);
    }

    function mostrarSecaoBemVindo(usuario) {
        container.className = `container tema-${usuario.avatar}`;
        container.style.backgroundColor = temasArvores[usuario.avatar].secundaria;
        container.style.borderColor = temasArvores[usuario.avatar].primaria;

        const arvoresPlantadas = calcularTotalArvoresPlantadas(usuario.username);
        const estagioAvatar = getEstagioAvatar(arvoresPlantadas);

        secaoBemVindo.innerHTML = `
            <h2>Bem-vindo, ${usuario.username}!</h2>
            <p>Você está representado pela ${usuario.avatar.replace('-', ' ').toUpperCase()}</p>
            <img src="${imagensAvatar[usuario.avatar]}" alt="${usuario.avatar}" class="avatar-selecionado estagio-avatar-${estagioAvatar}">
            <div class="botoes-acao">
                <button id="registrarPlantio">Cadastrar Plantio</button>
                <button id="verPerfil">Meu Perfil</button>
                <button id="verRelatorio">Relatório</button>
                <button id="botaoSair">Sair</button>
            </div>
            <div id="registrosPlantio"></div>
        `;

        // Configura os botões
        document.getElementById('registrarPlantio').addEventListener('click', () => {
            secaoBemVindo.style.display = 'none';
            formularioReflorestamento.style.display = 'block';
        });

        document.getElementById('verPerfil').addEventListener('click', () => {
            mostrarSecaoPerfil(usuarioAtual);
        });

        document.getElementById('verRelatorio').addEventListener('click', () => {
            secaoBemVindo.style.display = 'none';
            secaoRelatorio.style.display = 'block';
            if (!localStorage.getItem('registrosPlantio')) {
                gerarDadosMockados();
            }
            gerarRelatorio();
        });

        document.getElementById('botaoSair').addEventListener('click', () => {
            localStorage.removeItem('dadosUsuario');
            location.reload();
        });

        secaoBemVindo.style.display = 'block';
        formularioCadastro.style.display = 'none';
        selecaoAvatar.style.display = 'none';
        formularioReflorestamento.style.display = 'none';
        secaoPerfil.style.display = 'none';
        secaoRelatorio.style.display = 'none';
        secaoTopUsuarios.style.display = 'none';
        mostrarMenuNavegacao();

        carregarRegistrosPlantio();
    }

    function mostrarFormularioLogin() {
        formularioCadastro.style.display = 'block';
        selecaoAvatar.style.display = 'none';
        secaoBemVindo.style.display = 'none';
        formularioReflorestamento.style.display = 'none';
        secaoPerfil.style.display = 'none';
        secaoRelatorio.style.display = 'none';
        secaoTopUsuarios.style.display = 'none';
        esconderMenuNavegacao();
        container.className = 'container';
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';
    }

    function registrarPlantio(e) {
        e.preventDefault();
        
        const registroPlantio = {
            usuario: usuarioAtual.username,
            especie: document.getElementById('especieArvore').value,
            quantidade: parseInt(document.getElementById('quantidadeArvores').value),
            data: document.getElementById('dataPlantio').value,
            timestamp: new Date().toISOString(),
            avatar: usuarioAtual.avatar
        };

        const registros = JSON.parse(localStorage.getItem('registrosPlantio') || '[]');
        registros.push(registroPlantio);
        localStorage.setItem('registrosPlantio', JSON.stringify(registros));

        alert(`${registroPlantio.quantidade} ${getNomeEspecie(registroPlantio.especie)} plantadas com sucesso!`);
        formularioPlantio.reset();
        carregarRegistrosPlantio();
        
        if (secaoBemVindo.style.display === 'block') {
            mostrarSecaoBemVindo(usuarioAtual);
        }
    }

    function mostrarSecaoPerfil(usuario) {
        const dadosUsuario = {
            ...usuario,
            bio: localStorage.getItem(`${usuario.username}_bio`) || '',
            arvoresPlantadas: calcularTotalArvoresPlantadas(usuario.username)
        };

        const estagioAvatar = getEstagioAvatar(dadosUsuario.arvoresPlantadas);

        document.getElementById('nomeUsuario').textContent = dadosUsuario.username;
        document.getElementById('biografiaUsuario').value = dadosUsuario.bio;
        document.getElementById('contadorArvores').textContent = `Árvores plantadas: ${dadosUsuario.arvoresPlantadas}`;
        
        const avatarPerfil = document.getElementById('avatarPerfil');
        avatarPerfil.src = imagensAvatar[usuario.avatar];
        avatarPerfil.className = `avatar-perfil estagio-avatar-${estagioAvatar}`;
        
        atualizarBarraProgresso(dadosUsuario.arvoresPlantadas);
        
        secaoBemVindo.style.display = 'none';
        secaoPerfil.style.display = 'block';
        container.className = `container tema-${usuario.avatar}`;
        mostrarMenuNavegacao();
    }

    function gerarRelatorio() {
        const filtroUsuario = document.getElementById('usuarioRelatorio').value.trim().toLowerCase();
        const filtroEspecie = document.getElementById('especieRelatorio').value;
        
        const todosRegistros = JSON.parse(localStorage.getItem('registrosPlantio') || '[]');
        
        const registrosFiltrados = todosRegistros.filter(registro => {
            const correspondeUsuario = !filtroUsuario || 
                                  registro.usuario.toLowerCase().includes(filtroUsuario);
            const correspondeEspecie = !filtroEspecie || 
                                 registro.especie === filtroEspecie;
            return correspondeUsuario && correspondeEspecie;
        });
        
        if (registrosFiltrados.length === 0) {
            resultadosRelatorio.innerHTML = '<p>Nenhum registro encontrado com os filtros aplicados.</p>';
            return;
        }
        
        const agrupadoPorUsuario = {};
        registrosFiltrados.forEach(registro => {
            if (!agrupadoPorUsuario[registro.usuario]) {
                agrupadoPorUsuario[registro.usuario] = [];
            }
            agrupadoPorUsuario[registro.usuario].push(registro);
        });
        
        let htmlRelatorio = '<div class="resumo-relatorio">';
        htmlRelatorio += `<p>Total de registros encontrados: ${registrosFiltrados.length}</p>`;
        htmlRelatorio += `<p>Total de árvores plantadas: ${registrosFiltrados.reduce((soma, registro) => soma + registro.quantidade, 0)}</p>`;
        htmlRelatorio += '</div>';
        
        htmlRelatorio += '<div class="detalhes-relatorio">';
        
        for (const username in agrupadoPorUsuario) {
            const registrosUsuario = agrupadoPorUsuario[username];
            const totalUsuario = registrosUsuario.reduce((soma, registro) => soma + registro.quantidade, 0);
            
            htmlRelatorio += `<div class="relatorio-usuario">`;
            htmlRelatorio += `<h4>Usuário: ${username}</h4>`;
            htmlRelatorio += `<p>Total de árvores plantadas: ${totalUsuario}</p>`;
            
            htmlRelatorio += `<div class="registros-usuario">`;
            registrosUsuario.forEach(registro => {
                htmlRelatorio += `<div class="item-registro">`;
                htmlRelatorio += `<p><strong>Espécie:</strong> ${getNomeEspecie(registro.especie)}</p>`;
                htmlRelatorio += `<p><strong>Quantidade:</strong> ${registro.quantidade}</p>`;
                htmlRelatorio += `<p><strong>Data:</strong> ${formatarData(registro.data)}</p>`;
                htmlRelatorio += `</div>`;
            });
            htmlRelatorio += `</div></div>`;
        }
        
        htmlRelatorio += '</div>';
        resultadosRelatorio.innerHTML = htmlRelatorio;
    }

    function carregarTopUsuarios() {
        let topUsuarios = [];
        
        if (localStorage.getItem('registrosPlantio')) {
            const registros = JSON.parse(localStorage.getItem('registrosPlantio'));
            const estatisticasUsuarios = {};
            
            registros.forEach(registro => {
                if (!estatisticasUsuarios[registro.usuario]) {
                    estatisticasUsuarios[registro.usuario] = {
                        username: registro.usuario,
                        avatar: registro.avatar,
                        arvoresPlantadas: 0
                    };
                }
                estatisticasUsuarios[registro.usuario].arvoresPlantadas += registro.quantidade;
            });
            
            topUsuarios = Object.values(estatisticasUsuarios)
                .sort((a, b) => b.arvoresPlantadas - a.arvoresPlantadas)
                .slice(0, 3);
        } else {
            topUsuarios = [
                { username: 'Otto', avatar: 'pau-brasil', arvoresPlantadas: 1250 },
                { username: 'Vanderlei', avatar: 'castanheira', arvoresPlantadas: 980 },
                { username: 'Andrezza', avatar: 'peroba-rosa', arvoresPlantadas: 750 }
            ];
        }

        containerTopUsuarios.innerHTML = topUsuarios.map(usuario => `
            <div class="cartao-top-usuario">
                <img src="${imagensAvatar[usuario.avatar]}" alt="${usuario.username}" class="avatar-top-usuario">
                <div class="nome-top-usuario">${usuario.username}</div>
                <div class="arvores-top-usuario">${usuario.arvoresPlantadas} árvores</div>
            </div>
        `).join('');
    }

    function carregarRegistrosPlantio() {
        const registros = JSON.parse(localStorage.getItem('registrosPlantio') || '[]');
        const registrosUsuario = registros.filter(r => r.usuario === usuarioAtual?.username);
        const container = document.getElementById('registrosPlantio');
        
        container.innerHTML = registrosUsuario.length > 0 ? `
            <h3>Seus Registros de Plantio</h3>
            <div class="lista-registros">
                ${registrosUsuario.map(registro => `
                    <div class="cartao-registro">
                        <p><strong>Espécie:</strong> ${getNomeEspecie(registro.especie)}</p>
                        <p><strong>Quantidade:</strong> ${registro.quantidade}</p>
                        <p><strong>Data:</strong> ${formatarData(registro.data)}</p>
                    </div>
                `).join('')}
            </div>
        ` : '<p>Nenhum registro de plantio encontrado.</p>';
    }

    function gerarDadosMockados() {
        const usuariosMock = [
            { username: 'Mauricio', avatar: 'pau-brasil' },
            { username: 'Fernando', avatar: 'castanheira' },
            { username: 'Rodrigo', avatar: 'peroba-rosa' },
            { username: 'Andrezza', avatar: 'pau-brasil' },
            { username: 'Otto', avatar: 'castanheira' },
            { username: 'Vanderlei', avatar: 'peroba-rosa' }
        ];
        
        const especies = ['ipe', 'angico', 'aroeira', 'jequitiba', 'peroba-campo'];
        
        const registrosMock = [];
        
        usuariosMock.forEach(usuario => {
            const quantidadeRegistros = Math.floor(Math.random() * 5) + 3;
            
            for (let i = 0; i < quantidadeRegistros; i++) {
                const diasAtras = Math.floor(Math.random() * 365);
                const data = new Date();
                data.setDate(data.getDate() - diasAtras);
                
                registrosMock.push({
                    usuario: usuario.username,
                    especie: especies[Math.floor(Math.random() * especies.length)],
                    quantidade: Math.floor(Math.random() * 50) + 10,
                    data: data.toISOString().split('T')[0],
                    timestamp: data.toISOString(),
                    avatar: usuario.avatar
                });
            }
        });
        
        localStorage.setItem('registrosPlantio', JSON.stringify(registrosMock));
    }

    function atualizarBarraProgresso(arvoresPlantadas) {
        const preenchimentoProgresso = document.getElementById('preenchimentoProgresso');
        const imagemProgresso = document.getElementById('imagemProgresso');
        const porcentagem = Math.min((arvoresPlantadas / 700) * 100, 100);
        preenchimentoProgresso.style.width = `${porcentagem}%`;
        
        let estagioAtual = 'plantada';
        if (arvoresPlantadas >= 701) estagioAtual = 'madura';
        else if (arvoresPlantadas >= 301) estagioAtual = 'jovem';
        else if (arvoresPlantadas >= 101) estagioAtual = 'broto';
        
        imagemProgresso.src = imagensProgresso[estagioAtual];
        imagemProgresso.alt = `Estágio ${estagioAtual}`;
        
        document.querySelectorAll('.marcador').forEach(marcador => {
            const objetivo = parseInt(marcador.dataset.objetivo);
            let estaAtivo = false;
            
            if (objetivo === 100) estaAtivo = arvoresPlantadas >= 0;
            else if (objetivo === 300) estaAtivo = arvoresPlantadas >= 101;
            else if (objetivo === 700) estaAtivo = arvoresPlantadas >= 301;
            else if (objetivo === 1500) estaAtivo = arvoresPlantadas >= 701;
            
            marcador.classList.toggle('ativo', estaAtivo);
        });
    }

    function salvarBiografia() {
        const bio = document.getElementById('biografiaUsuario').value;
        localStorage.setItem(`${usuarioAtual.username}_bio`, bio);
        alert('Biografia salva com sucesso!');
        usuarioAtual.bio = bio;
        localStorage.setItem('dadosUsuario', JSON.stringify(usuarioAtual));
    }

    function calcularTotalArvoresPlantadas(username) {
        const registros = JSON.parse(localStorage.getItem('registrosPlantio') || '[]');
        return registros.filter(r => r.usuario === username)
                     .reduce((total, registro) => total + registro.quantidade, 0);
    }

    function getEstagioAvatar(arvoresPlantadas) {
        if (arvoresPlantadas >= 701) return 4;
        if (arvoresPlantadas >= 301) return 3;
        if (arvoresPlantadas >= 101) return 2;
        return 1;
    }

    function getNomeEspecie(especie) {
        const nomes = { 
            'ipe': 'Ipê', 
            'angico': 'Angico', 
            'aroeira': 'Aroeira', 
            'jequitiba': 'Jequitibá', 
            'peroba-campo': 'Peroba do Campo' 
        };
        return nomes[especie] || especie;
    }

    function formatarData(dataString) {
        return new Date(dataString).toLocaleDateString('pt-BR');
    }
});
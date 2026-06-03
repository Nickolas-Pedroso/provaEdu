document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLoginPage');
    const msg = document.getElementById('msgLoginPage');
    const profileSection = document.getElementById('profileSection');
    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');
    const profileUsuario = document.getElementById('profileUsuario');
    const profileEmail = document.getElementById('profileEmail');
    const profileObservacao = document.getElementById('profileObservacao');
    const btnLogout = document.getElementById('btnLogout');

    const showProfile = (aluno) => {
        profileName.innerText = aluno.nome_completo || 'Sem nome';
        profileUsuario.innerText = aluno.usuario_acesso || 'Sem usuário';
        profileEmail.innerText = aluno.email_aluno || 'Sem e-mail';
        profileObservacao.innerText = aluno.observacao || 'Sem observação';

        if (aluno.foto) {
            profileImage.src = aluno.foto;
            profileImage.alt = aluno.nome_completo || 'Foto do aluno';
        } else {
            profileImage.src = 'https://via.placeholder.com/260x260?text=Sem+Foto';
            profileImage.alt = 'Sem foto disponível';
        }

        form.classList.add('hidden');
        profileSection.classList.remove('hidden');
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;

        if (!usuario || !senha) {
            msg.innerText = 'Preencha usuário e senha.';
            msg.className = 'error';
            return;
        }

        msg.innerText = 'Verificando...';
        msg.className = '';

        const BACKEND_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://seu-backend.onrender.com';

        try {
            const resp = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            const text = await resp.text();
            let result = null;
            try {
                result = JSON.parse(text);
            } catch (parseError) {
                console.warn('Resposta não JSON do servidor:', text);
            }

            if (resp.ok && result && result.aluno) {
                msg.innerText = 'Login bem-sucedido. Bem-vindo: ' + (result.aluno.nome_completo || result.aluno.usuario_acesso);
                msg.className = 'success';
                showProfile(result.aluno);
            } else {
                let errorMessage = 'Falha no login.';
                if (result && result.erro) {
                    errorMessage = result.erro;
                } else if (text) {
                    errorMessage = text;
                }
                msg.innerText = errorMessage;
                msg.className = 'error';
            }
        } catch (err) {
            console.error(err);
            msg.innerText = 'Erro na conexão com o servidor.';
            msg.className = 'error';
        }
    };

    btnLogout.onclick = () => {
        form.reset();
        msg.innerText = '';
        form.classList.remove('hidden');
        profileSection.classList.add('hidden');
    };
});

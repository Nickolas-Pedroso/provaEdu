// script.js

document.addEventListener('DOMContentLoaded', () => {
    const formAluno = document.getElementById('formAluno');
    const msg = document.getElementById('msg');

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    formAluno.onsubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const nome = document.getElementById('nome').value.trim();
        const usuario = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const observacao = document.getElementById('observacao').value.trim();
        const foto = document.getElementById('foto').files[0];

        if (!nome || !usuario || !email || !senha) {
            msg.innerText = 'Por favor, preencha todos os campos obrigatórios.';
            msg.className = 'error';
            return;
        }

        if (!email.includes('@')) {
            msg.innerText = 'O e-mail precisa conter o caractere @.';
            msg.className = 'error';
            return;
        }

        if (!isValidEmail(email)) {
            msg.innerText = 'Por favor, informe um e-mail válido.';
            msg.className = 'error';
            return;
        }

        if (senha.length < 6) {
            msg.innerText = 'A senha deve ter pelo menos 6 caracteres.';
            msg.className = 'error';
            return;
        }

        if (foto) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(foto.type)) {
                msg.innerText = 'Apenas imagens JPEG, PNG ou GIF são permitidas.';
                msg.className = 'error';
                return;
            }
            if (foto.size > 5 * 1024 * 1024) {
                msg.innerText = 'A imagem deve ter no máximo 5MB.';
                msg.className = 'error';
                return;
            }
        }

        // Limpa mensagens anteriores e envia o formulário
        msg.innerText = 'Enviando dados...';
        msg.className = '';

        const formData = new FormData(formAluno);

        try {
            const resp = await fetch('/cadastrar', {
                method: 'POST',
                body: formData
            });

            const result = await resp.json();

            if (resp.ok) {
                msg.innerText = result.mensagem;
                msg.className = 'success';
                formAluno.reset();
            } else {
                msg.innerText = result.erro || 'Erro ao cadastrar aluno.';
                msg.className = 'error';
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            msg.innerText = 'Não foi possível conectar ao servidor.';
            msg.className = 'error';
        }
    };

    // (Login/listagem moved to separate page `login.html`)
});
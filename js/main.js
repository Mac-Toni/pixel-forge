/**
 * PIXEL FORGE - Main JavaScript
 * Unificado para Contato e Trabalhe Conosco
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS COMUNS ---
    const btnTop = document.getElementById("btnTop");
    const successMsg = document.getElementById('success-message');

    // --- 1. VOLTAR AO TOPO ---
    if (btnTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btnTop.classList.add("visivel");
            } else {
                btnTop.classList.remove("visivel");
            }
        });

        btnTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- 2. LÓGICA DE FORMULÁRIOS (CONTATO E TRABALHE CONOSCO) ---
    const formContato = document.getElementById('form-contato');
    const formTrabalhe = document.getElementById('form-recrutamento');
    
    // Define qual formulário está ativo na página atual
    const activeForm = formContato || formTrabalhe;
    
    // Define qual input de arquivo e nome está ativo
    const fileInput = document.getElementById('anexo-projeto') || document.getElementById('curriculo-upload');
    const fileNameDisplay = document.getElementById('file-name');

    if (activeForm) {
        // Exibição e validação do nome do arquivo
        if (fileInput && fileNameDisplay) {
            fileInput.addEventListener('change', function() {
                const limiteMB = 5;
                if (this.files && this.files.length > 0) {
                    const tamanhoArquivo = this.files[0].size / 1024 / 1024;
                    if (tamanhoArquivo > limiteMB) {
                        alert("Arquivo muito grande! Máximo 5MB.");
                        this.value = "";
                        fileNameDisplay.textContent = "Erro: Máximo 5MB";
                        fileNameDisplay.style.color = "#FF4500";
                    } else {
                        fileNameDisplay.textContent = `Arquivo: ${this.files[0].name}`;
                        fileNameDisplay.style.color = "#39FF14";
                        fileNameDisplay.style.opacity = "1";
                    }
                }
            });
        }

        // Envio via AJAX (Fetch API)
        activeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = activeForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Forjando Envio...';
            btn.disabled = true;
            activeForm.style.opacity = '0.5';

            const formData = new FormData(activeForm);

            fetch(activeForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    activeForm.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                    window.scrollTo({ top: successMsg ? successMsg.offsetTop - 100 : 0, behavior: 'smooth' });
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                alert("Ocorreu um erro. Verifique sua conexão e tente novamente.");
                btn.innerText = originalText;
                btn.disabled = false;
                activeForm.style.opacity = '1';
            });
        });
    }

    // --- 3. CLIQUE GLOBAL PARA LIBERAR PÁGINA ---
    document.addEventListener('click', () => {
        // Se a mensagem de sucesso estiver visível, qualquer clique a fecha
        if (successMsg && successMsg.style.display === 'block') {
            successMsg.style.display = 'none';
            
            // Reabilita o formulário se o usuário quiser enviar outro
            if (activeForm) {
                activeForm.style.display = 'block';
                activeForm.style.opacity = '1';
                activeForm.reset();
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = "Nenhum arquivo selecionado";
                    fileNameDisplay.style.color = "inherit";
                }
                const btn = activeForm.querySelector('button');
                btn.disabled = false;
                btn.innerText = activeForm.id === 'form-contato' ? 'Enviar para a Forja' : 'Enviar Candidatura';
            }
        }
    });
});
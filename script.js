'use strict';

document.addEventListener("DOMContentLoaded", function() {
    const sections = [
        { sentence: "Un Jardin Merveilleusement Sonore." },
        { sentence: "音の庭" },
        { sentence: "Aumenta o som, por favor." },
        { sentence: "この曲のリズムは素晴らしいですね" },
        { sentence: "Le rythme de cette chanson est incroyable!" },
        { sentence: "I can't stop dancing to this beat!" },
        { sentence: "What's the name of this track?" },
        { sentence: "このトラックの名前は何ですか" },
        { sentence: "C'est génial de l'écouter en boucle!" },
        { sentence: "This song is my new jam." },
        { sentence: "この曲は私の新しいお気に入りです" },
        { sentence: "Vamos dançar até o amanhecer..." },
        { sentence: "夜明けまで踊りましょう" },
        { sentence: "I can't get enough of this beat." },
        { sentence: "Cette playlist est un chef-d'œuvre!" },
        { sentence: "このプレイリストは傑作です" },
        { sentence: "Essa música me anima sempre..." },
        { sentence: "この曲はいつも気分を高めてくれます" },
        { sentence: "Cette mélodie est contagieuse!" },
        { sentence: "Who's the DJ behind this?" },
        { sentence: "Nothing but positive vibes!" },
        { sentence: "Cette playlist est un bijou." },
        { sentence: "A música é a linguagem universal!" },
    ];

    let i = 0; // Índice da frase atual
    let j = 0; // Índice do caractere atual na frase
    let currentPart = ""; // Parte da frase atualmente exibida
    let forward = true; // Direção da "digitação" (para frente ou para trás)
    let interval = 50; // Intervalo da animação
    let opening = false; // Flag para a lógica de inicialização

    const textElement = document.querySelector(".jstext");
    const afterTypingElement = document.querySelector(".afterTyping"); // Cache do elemento .afterTyping

    function writing() {
        if (!textElement) return; // Sai se o elemento .jstext não existir

        const currentSentence = sections[i].sentence;
        const sentenceLength = currentSentence.length;

        if (!opening) {
            // Lógica de inicialização simplificada: adiciona <br> uma vez no início.
            setTimeout(() => {
                currentPart = "&nbsp; <br>"; // Adiciona um espaço não quebrável para garantir altura se jstext estiver vazio
                textElement.innerHTML = currentPart;
                opening = true;
                writing(); // Chama recursivamente para iniciar a digitação
            }, interval);
            return;
        }

        setTimeout(() => {
            interval = 50; // Reset do intervalo padrão

            if (j === sentenceLength) {
                forward = false; // Chegou ao fim, começa a apagar
            }

            // Adiciona classe .onScreen ao .afterTyping (se existir) um pouco antes do fim da frase
            if (j === sentenceLength - 2 && forward && afterTypingElement) {
                afterTypingElement.classList.add("onScreen");
            }

            // Pausa no final da frase antes de apagar
            if (j === sentenceLength -1 && forward) { // Alterado para -1 para pausar no último caractere
                interval = 2000;
            }

            if (forward) { // Digitando para frente
                if (j < sentenceLength) {
                    if (currentSentence[j] === "&") {
                        currentPart += "<strong>";
                    } else if (currentSentence[j] === "%") {
                        currentPart += "</strong>";
                    } else {
                        currentPart += currentSentence[j];
                    }
                    j++;
                }
            } else { // Apagando (para trás)
                if (j > 0) {
                     // A lógica para remover <strong> e </strong> precisa do caractere atual (que já foi processado)
                     // Então verificamos o caractere *antes* de decrementar j
                    const charBeingRemoved = currentSentence[j-1]; // Caractere que será efetivamente removido
                    if (charBeingRemoved === "&") {
                        currentPart = currentPart.slice(0, -8); // Remove "<strong>"
                    } else if (charBeingRemoved === "%") {
                        currentPart = currentPart.slice(0, -9); // Remove "</strong>"
                    } else {
                        currentPart = currentPart.slice(0, -1); // Remove o último caractere normal
                    }
                    j--;
                } else { // Chegou ao início da frase (apagou tudo)
                    forward = true;
                    i++; // Próxima frase
                    if (i === sections.length) {
                        i = 0; // Volta para a primeira frase
                    }
                    // Remove a classe de .afterTyping para a próxima frase, se existir
                    if (afterTypingElement) {
                        afterTypingElement.classList.remove("onScreen");
                    }
                }
            }
            textElement.innerHTML = currentPart;
            writing(); // Chamada recursiva para o próximo caractere/passo
        }, interval);
    }

    // Inicia o efeito de digitação após um pequeno atraso
    if (textElement) {
        setTimeout(writing, 1); // Pequeno delay inicial
    }

    // Lógica do conteúdo expansível
    const expandirButton = document.getElementById("expandir");
    const collapsibleContent = document.getElementById("collapsible-content");

    if (expandirButton && collapsibleContent) {
        expandirButton.addEventListener("click", () => {
            const isHidden = collapsibleContent.style.display === "none" || collapsibleContent.style.display === "";
            collapsibleContent.style.display = isHidden ? "block" : "none";
        });
    }

    // Lógica para .loopCol e .fixedBg
    const loopColElements = document.querySelectorAll('.loopCol');
    const jstextElementForLoop = document.getElementById("jstext"); // Cache para esta seção também

    function findAssociatedFixedBg(element) {
        let sibling = element.nextElementSibling;
        while (sibling && !sibling.classList.contains('fixedBg')) {
            sibling = sibling.nextElementSibling;
        }
        return sibling;
    }

    function showFixedBg(loopColElem) {
        if (jstextElementForLoop) jstextElementForLoop.classList.add("hidden");
        const fixedBg = findAssociatedFixedBg(loopColElem);
        if (fixedBg) {
            fixedBg.classList.add('show');
        }
    }

    function hideFixedBg(loopColElem) {
        if (jstextElementForLoop) jstextElementForLoop.classList.remove("hidden");
        const fixedBg = findAssociatedFixedBg(loopColElem);
        if (fixedBg) {
            fixedBg.classList.remove('show');
        }
    }
    
    loopColElements.forEach((loopColElement) => {
        loopColElement.addEventListener('mouseenter', function() { showFixedBg(this); });
        // O 'click' estava comentado, mantendo assim. Se precisar, descomente:
        // loopColElement.addEventListener('click', function() { showFixedBg(this); });
        loopColElement.addEventListener('mouseleave', function() { hideFixedBg(this); });
        loopColElement.addEventListener('touchstart', function(event) {
            // event.preventDefault(); // Prevenir scroll/zoom se o touchstart for para isso.
            // Se o objetivo é apenas mostrar o fixedBg no toque, o preventDefault aqui pode não ser necessário
            // A menos que o .loopCol seja um link ou algo que não deva ser ativado.
            showFixedBg(this);
        }, { passive: true }); // Adicionado passive:true para touchstart se não houver preventDefault

        loopColElement.addEventListener('touchend', (event) => {
            event.preventDefault(); // Mantido conforme original, para evitar "ghost clicks" ou outras ações padrão
            // Se após o touchstart e o showFixedBg, o usuário não fizer touchmove,
            // o fixedBg permanece visível. O click global ou touchmove global o esconderá.
        });
    });

    // Listeners globais para esconder .fixedBg
    const allFixedBgElements = document.querySelectorAll('.fixedBg');

    function hideAllFixedBgs() {
        allFixedBgElements.forEach((element) => {
            element.classList.remove('show');
        });
        if (jstextElementForLoop && jstextElementForLoop.classList.contains("hidden")) {
             // Apenas remove 'hidden' do jstext se ele foi escondido por um .loopCol
             // e não por outra lógica.
             // Para simplificar, vamos sempre tentar remover, pois a lógica de .loopCol o re-esconderá se necessário.
             // jstextElementForLoop.classList.remove("hidden");
        }
    }
    
    // Oculta fixedBg em touchmove NO DOCUMENTO
    document.addEventListener('touchmove', () => {
        // Se o usuário começar a rolar a página enquanto um fixedBg estiver visível, esconda-o.
        hideAllFixedBgs();
        if (jstextElementForLoop) jstextElementForLoop.classList.remove("hidden"); // Garante que jstext volte
    });

    // Oculta fixedBg em clique NO DOCUMENTO
    document.addEventListener('click', (event) => {
        // Verifica se o clique não foi em um elemento .loopCol
        // para evitar que o fixedBg seja escondido imediatamente após ser mostrado por um clique (se o listener de clique no loopCol estivesse ativo)
        if (event.target.closest && !event.target.closest('.loopCol')) {
            hideAllFixedBgs();
            if (jstextElementForLoop) jstextElementForLoop.classList.remove("hidden"); // Garante que jstext volte
        } else if (!event.target.closest) { // Fallback para navegadores mais antigos se closest não existir
            hideAllFixedBgs();
            if (jstextElementForLoop) jstextElementForLoop.classList.remove("hidden");
        }
    });
});
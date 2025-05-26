   function setTheme() {
      const logo = document.getElementById('logo-img');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
        if (logo) logo.src = 'https://jardimsonoro.com/jslogo.png'; // versão dark
      } else {
        document.body.classList.remove('dark');
        if (logo) logo.src = 'https://jardimsonoro.com/jslogob.png'; // versão light
      }
    }

    // Executar ao carregar a página
    setTheme();

    // Escutar mudanças no sistema do usuário
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

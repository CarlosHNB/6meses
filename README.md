# Pour mon amour 💫

Uma carta digital interativa — um curta-metragem em forma de site — feita para ser aberta a partir de um QR Code em uma carta física.

## Como abrir

Basta abrir `index.html` no navegador. Não há build, não há dependências para instalar — é HTML, CSS e JavaScript puros. Funciona perfeitamente hospedado no **GitHub Pages**.

## Estrutura do projeto

```
pour-mon-amour/
├── index.html              → as 6 telas da experiência
├── css/
│   ├── style.css           → paleta, tipografia, layout, componentes
│   └── animations.css      → keyframes (reveals, batimento, estrela cadente...)
├── js/
│   ├── particles.js        → céu estrelado em <canvas> + estrela cadente
│   ├── audio.js             → música de fundo (fade in/out, inicia no 1º toque)
│   ├── video.js             → player de vídeo customizado da Tela 5
│   └── app.js                → navegação entre telas, carta letra-por-letra, envelope
└── assets/
    ├── audio/musica.mp3     → ⚠️ adicione sua música aqui
    ├── video/video.mp4      → ⚠️ adicione seu vídeo aqui
    └── img/video-poster.jpg → (opcional) capa exibida antes do vídeo carregar
```

## ⚠️ Antes de publicar — arquivos que você precisa adicionar

Por limite de tamanho, os arquivos de mídia não foram incluídos. Adicione:

1. **`assets/audio/musica.mp3`** — a música de fundo. Ela nunca toca sozinha: só começa no primeiro toque da pessoa na tela (exigência dos navegadores e também do roteiro).
2. **`assets/video/video.mp4`** — o vídeo da Tela 5 ("Seis meses com você"). Recomendo exportar em 16:9, até ~30–50MB para carregar rápido no celular.
3. *(Opcional)* **`assets/img/video-poster.jpg`** — uma imagem de capa (frame do vídeo) exibida antes do play.

Se algum desses arquivos não existir, a tela correspondente ainda funciona (ela simplesmente não tem som/vídeo) — nada quebra.

## Personalizar o texto da carta

Abra `js/app.js` e edite o array `LETTER_PARAGRAPHS` no topo do arquivo — cada item do array vira um parágrafo, animado letra por letra automaticamente.

## Publicar no GitHub Pages

1. Crie um repositório novo (pode ser privado ou público) e envie todos os arquivos desta pasta para a raiz dele.
2. No GitHub, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch (geralmente `main`) e a pasta `/root`.
4. Salve. Em alguns minutos o site estará em algo como `https://seu-usuario.github.io/nome-do-repositorio/`.
5. Gere o QR Code desse link (qualquer gerador online serve) e coloque na carta física.

## Detalhes técnicos

- **Sem frameworks** — HTML5, CSS3 e JavaScript vanilla, como pedido.
- **Canvas** para o céu estrelado (estrelas cintilantes + poeira de luz), com pausa automática quando a aba não está visível, para poupar bateria.
- **Transições cinematográficas** entre telas: fade + blur + leve zoom, nunca corte seco.
- **Envelope interativo**: toque para abrir → a carta desliza para cima e o texto aparece letra por letra.
- **Player de vídeo próprio**, sem controles nativos do navegador — barra de progresso, play/pause, som e tela cheia com visual coerente com o resto do site.
- **Música**: nunca toca automaticamente; inicia no primeiro toque em qualquer lugar da tela, com fade-in suave, e pode ser pausada no botão flutuante no canto inferior direito.
- **Mobile-first**: todo o layout foi pensado primeiro para celular (ela abrirá pelo QR Code), com breakpoints para desktop depois.
- **Acessibilidade**: navegação por teclado (seta direita avança), foco visível, e respeito à preferência `prefers-reduced-motion`.

Feito com todo o cuidado. 💌

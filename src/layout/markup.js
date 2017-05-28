module.exports = `<!doctype html>
<html>
<head>
    <title>Launcher</title>
    <mata charset="utf-8"/>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"/>
</head>
<body>
    <div id='root'></div>
    <script src="${process.env.NODE_ENV === 'development' ? '//localhost:3001' : ''}/static/bundle.js"></script>
</body>
</html>`;
<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ValuaTank | El Código de la Valuación & Simulador Shark Tank</title>
    <meta name="description" content="Aprende a dominar tus números, calcular tu valuación implícita y defender tu valor frente a los inversionistas con ValuaTank.">

    <script>
        (function() {
            try {
                const stored = localStorage.getItem('valuetank_theme') || 'system';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = stored === 'dark' || (stored === 'system' && prefersDark);
                if (isDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                const meta = document.querySelector('meta[name="color-scheme"]');
                if (meta) {
                    meta.content = isDark ? 'dark' : 'light';
                }
            } catch (e) {}
        })();
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
    <div id="root" class="min-h-full"></div>
</body>
</html>

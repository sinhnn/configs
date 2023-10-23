/**
 *
 * @param {string} str
 */
function copyToClipboard (str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};



let hosts = new Set(Array.from(document.body.querySelectorAll('a[href]'))
                            .map(a => (new URL(a.href).origin.replace("www.", ""))));

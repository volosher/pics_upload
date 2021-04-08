function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 Byte';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}


const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if (classes.length) {
        node.classList.add(...classes);
    }

    if (content) {
        node.textContent = content;
    }

    return node;

    };

  function noop() {}

export function upload(selector, options = {} ) {
    let files = [];
    let onUpload = options.onUpload ?? noop;
    const input = document.querySelector(selector);
    const preview = element('div', ['preview']);

    const open = element('btn', ['btn'], 'Open');
    const upLoad = element('btn', ['btn', 'primary'], 'Load');
    upLoad.style.display = 'none';

    if (options.multiLoad) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upLoad);
    input.insertAdjacentElement('afterend', open);


    const triggerInput = () => input.click();

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';
        upLoad.style.display = 'inline';

        files.forEach(file => {
           if (!file.type.match('image')) {
               return

               }

           const reader = new FileReader();

           reader.onload = ev => {
               const src = ev.target.result;
               preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                <div class="preview-remove" data-name="${file.name}">&times;</div>
                <img src="${src}" alt="${file.name}"/>
                <div class="preview-info">
                    <span>${file.name}</span>
                    ${bytesToSize(file.size)}
                </div>
                </div>
            `);
           };

           reader.readAsDataURL(file);
        });

    };

    const removeHandler = event => {
        console.log(event);
        if (!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset;
        files = files.filter(file => file.name !== name);

        if (!files.length) {
        upLoad.style.display = 'none';
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');

        block.classList.add('removing');
        setTimeout(() => block.remove(), 300);
    };

    const clearPreview = (el) => {
        el.style.bottom = '4px';
        el.innerHTML = `<div class="preview-info-progress"></div>`
    };

    const upLoadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove());
        const previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo);
    };

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upLoad.addEventListener('click', upLoadHandler);
}



export default class Panel {
    constructor(selector, url, data) {
        var self = this;
        this.data = data;
        var keys = Object.keys(this.data);
        var html = '';
        for (var i = 0; i < keys.length; i++) {
            html += `<tr>
            <td width="10%">
            <input type="radio" name="rack" value="${keys[i]}">
            </td>
            <td width="80%">
                <a style="color: inherit; text-decoration: none;" href="${url}?name=${keys[i]}">
                ${keys[i]}
                </a>
            </td>
            <td width="10%"><div class="${Math.round(Math.random()) ? 'red-dot' : 'green-dot'}"></div></td>
            </tr>`;
        }
        document.querySelector(selector).innerHTML = html;
        document.querySelectorAll(`${selector} tr td input`).forEach( o => {
            o.onclick = function() {
                self.select(this);
            };
        });
    }

    select(e) {
        if(this.onselectCallback) 
            this.onselectCallback(this.data[e.value]);
    };

    onselect(onselectCallback) {
        this.onselectCallback = onselectCallback;
    }
}

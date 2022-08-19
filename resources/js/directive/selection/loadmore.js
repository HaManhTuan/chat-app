export default {
  bind(el, binding) {
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (CONDITION) {
        const ul = SELECTWRAP_DOM.firstChild;
        if (!ul.lastChild.classList.contains('last-loading')) {
          const li = document.createElement('li');
          li.className = 'el-select-dropdown__item last-loading';
          li.innerHTML = '<i id="select-loading" class="el-icon-loading"></i>';
          ul.appendChild(li);
          binding.value().finally(() => {
            li.remove();
          });
        }
      }
    });
  },
};

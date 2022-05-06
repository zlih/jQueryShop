$('form').on('submit', function (e) {
  e.preventDefault()

  const data = $('form').serialize()
  // console.log(data);
  $.post('http://localhost:2332/users/login', data, res => {
    // console.log(res);
    if ( res.code === 0 ) {
      $('form > span').css('display', 'block')
      return
    }

    // 记录token值, 给其它页面使用
    window.localStorage.setItem('token', res.token)
    window.localStorage.setItem('id', res.user.id)

    window.location.href = './index.html'
  })
})
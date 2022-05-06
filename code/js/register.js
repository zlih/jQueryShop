$('form').on('submit', function (e) {
  e.preventDefault()

  const data = $('form').serialize() 
  // 要给input加name属性, 用serialize获取username=fda&password=dfa...
  // console.log( typeof(data) );
  $.post('http://localhost:2332/users/register', data, res => {
    console.log(res);

    if ( res.code == 0) {
      $('form > span').css('display', 'block')
      return
    }

    window.alert('恭喜你, 注册成功啦')
    window.location.href = './login.html'
  })
})
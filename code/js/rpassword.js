const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')
// console.log(token, id);

if (!token || !id) {
  window.location.href = './login.js'
} else {
  getInfo()
}

function getInfo() {
  $.ajax({
    url: 'http://localhost:2332/users/info',
    method: 'GET',
    data: { id: id },
    headers: { authorization: token },
    success(res) {
      // console.log(res);
      if (res.code !== 1) {
        window.location.href = './login.html'
      }
    }
  })
}

$('form').on('submit', function (e) {
  e.preventDefault()

  const data = $('form').serialize()
  // console.log(data);
  $.ajax({
    url: 'http://localhost:2332/users/rpwd',
    method: 'POST',
    data: data + '&id=' + id,
    headers: {authorization: token},
    success (res) {
      // console.log(res);
      if ( res.code !== 1 ) {
        $('form > span').css('display', 'block')
        return
      }
      window.alert('恭喜您, 修改密码成功啦')
      window.location.href = './login.html'
    }
  })
})

const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')

if (!token || !id) {
  window.location.href = './login.html'
} else {
  getInfo()
}

function getInfo() {
  // console.log('获取信息啦');
  $.ajax({
    url: 'http://localhost:2332/users/info',
    method: 'GET',
    data: {id : id},
    headers: {authorization: token},
    success (res) {
      if ( res.code !==1 ) {
        window.location.href = './login.html'
        return
      } else {
        // console.log(res, res.info.username);
        $('form .username').val(res.info.username)
        $('form [name=nickname]').val(res.info.nickname)
        $('input[name=age]').val(res.info.age)
        $('form [name=gender]').val(res.info.gender)
      }
    }
  })
}

$('form').on('submit', function (e) {
  e.preventDefault()

  const data = $('form').serialize()
  // console.log(data);

  $.ajax({
    url: 'http://localhost:2332/users/update',
    method: 'POST',
    data: data + '&id=' + id,
    headers: {authorization: token},
    success (res) {
      // console.log(res);
      if ( res.code === 1 ) {
        alert('恭喜您修改用户信息成功了')
      }
    }
  })
})
# Api Ciname

Api server https://server-api-cinema.herokuapp.com/ \
Api geolocation https://opencagedata.com/api \
Api location:

- get citys https://provinces.open-api.vn/api/p
- get districts https://provinces.open-api.vn/api/p/{ city code }?depth=2
- get wards https://provinces.open-api.vn/api/d/{ district code }?depth=2

## `Index`

- [Auth](#auth)

## `Auth`

### Modal

     {
        "_id": string,
        "email": string,
        "phoneNumber": string,
        "profile": {
              "fullname": string,
              "avatar": string,
              "dateOfBirth": string,
              "hobby": string,
              "male": boolean,
              "address": string
        }
        "createdAt": string
      }

### Đăng ký

- Method post
- https://server-api-cinema.herokuapp.com/api/auth/register
- Content-Type: application/json
- body

      {
        "email": string,
        "phoneNumber": string,
        "password": string,
        "confirmPassword": string,
        "fullName": string,
        "address": {
              "city": string,
              "district": string,
              "ward": string,
              "street": string
        },
        "dateOfBirth": string (mm/dd/yyy)
      }

- res (nếu đăng ký thành công trả về values, ngược lại trả về errors)

      {
        "success": boolen,
        "message": string,

        "values": {
              "token": string,
              "user": obj User
              }
        "errors": {tên field: string...}
      }

### Đăng nhập

- Method post
- https://server-api-cinema.herokuapp.com/api/auth/login
- Content-Type: application/json
- body

      {
        "username": string(email hoặc phoneNumber),
        "password": string,
      }

- res (nếu đăng nhập thành công trả về values, ngược lại trả về errors)

      {
        "success": boolen,
        "message": string,

        "values": {
              "token": string,
              "user": obj User
              }
        "errors": {tên field: string...}
      }

### Lấy thông tin của user đăng nhập

- Method get
- https://server-api-cinema.herokuapp.com/api/auth/me
- Content-Type: application/json
- Authorization: Bearer <Token khi login hoặc register>
- res

      {
        "success": boolean,
        "message": string,
        "user": obj User
      }

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[ace editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[twitter bootstrap]: http://twitter.github.com/bootstrap/
[jquery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[angularjs]: http://angularjs.org
[gulp]: http://gulpjs.com
[pldb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[plgh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[plgd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[plod]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[plme]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[plga]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md

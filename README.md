# Api Ciname

Api server https://server-api-cinema.herokuapp.com/ \
Api geolocation https://opencagedata.com/api \
Api location:

- get citys https://provinces.open-api.vn/api/p
- get districts https://provinces.open-api.vn/api/p/{ city code }?depth=2
- get wards https://provinces.open-api.vn/api/d/{ district code }?depth=2

## `Index`

- [Cienma](#cinema)
- [Auth](#auth)
- [Permission](#Permission)
- [Staff](#staff)
- [Cast](#cast)
- [Director](#director)
- [Producer](#producer)
- [Category](#category)
- [Nation](#nation)
- [Movie](#movie)
- [ShowTime](#showTime)

## `Cinema`

### Modal

     {
          "_id": string,
          name: String,
          address: {
               city: String,
               district: String,
               ward: String,
               street: String,
               lat: String,
               lng: String,
          },
          createdAt: {
               type: String,
               default: new Date().toISOString(),
          },
      }

### Thêm rạp phim mới

- Method post
- https://server-api-cinema.herokuapp.com/api/cinema/add
- Content-Type: application/json
- body

      {
          "name":"CGV IMC Trần Quang Khải",
          "address":{
               "city":"Tp. Hồ Chí Minh",
               "district":" Q. 1",
               "ward":"P. Tân Định",
               "street":"TTVH Đa Năng, 62 Trần Quang Khải"
          }
      }

- res

      {
          "success": boolen,
          "message": string,

          "values": {
               "cinema": obj cinema,
          }
          "errors": {tên field: string...}
      }

### Chỉnh sửa rạp phim

- Method put
- https://server-api-cinema.herokuapp.com/api/cinema/update/:id
- Content-Type: application/json
- body

      {
          "name":"CGV IMC Trần Quang Khải",
          "address":{
               "city":"Tp. Hồ Chí Minh",
               "district":" Q. 1",
               "ward":"P. Tân Định",
               "street":"TTVH Đa Năng, 62 Trần Quang Khải"
          }
      }

- res

      {
          "success": boolen,
          "message": string,

          "values": {
               "cinema": obj cinema,
          }
          "errors": {tên field: string...}
      }

### Xóa rạp phim

- Method delete
- https://server-api-cinema.herokuapp.com/api/cinema/delete/:id
- Content-Type: application/json
- res

      {
          "success": boolen,
          "message": string,

          "values": {
               "cinema": obj cinema,
          }
          "errors": ""
      }

### Lấy danh sách rạp phim

- Method get
- https://server-api-cinema.herokuapp.com/api/cinema/all
- Content-Type: application/json
- res

      {
          "success": boolen,
          "message": string,

          "values": {
               "cinemas": [obj cinema],
          }
          "errors": ""
      }

### Lấy rạp phim theo id

- Method get
- https://server-api-cinema.herokuapp.com/api/cinema/:id
- Content-Type: application/json
- res

      {
          "success": boolen,
          "message": string,

          "values": {
               "cinema": obj cinema,
          }
          "errors": ""
      }

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
              "address": {
                   "city": string,
                  "district": string,
                  "ward": string,
                  "street": string
              }
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

## `Permission`

### Modal

     {
          "_id": string,
          "name": String,
          "type": string (0,1,2....)
      }

### Lấy danh sách quyền truy cập

- Method GET
- https://server-api-cinema.herokuapp.com/api/permission/all
- Content-Type: application/json
- res

      {
        "success": boolean,
        "message": string,
        "values":{
             "permissions": [obj permission]
        }
        "errors": ""
      }

## `Staff`

### Modal

     {
        "_id": string,
        "email": string,
        "phoneNumber": string,
        "profile": {
               "fullName": String,
               "avatar": String,
               "dateOfBirth": String,
               "male": Boolean,
               "address": String,
         },
          "createdAt": string,
          "permission": {
               "_id": string,
               "name": string,
               "type": string (0,1,2,....)
          },
          "cinema": obj cinema
      }

### Thêm nhân viên ( type = 0 và 1 mới có quyền thoa tác )

- Method post
- https://server-api-cinema.herokuapp.com/api/staff/register
- Content-Type: application/json
- Authorization: Bearer <token>
- body

      {
          "email":"26112000@gmail.com",
          "phoneNumber":"0983782941",
          "fullName":"Lê Nguyễn Hùng Vỹ",
          "male":true,
          "dateOfBirth":"11/26/2000",
          "permissionId":"6149d3ff52d8c52050d24e3c"
          "cinemaId":"614c03db576b5d00376801a6"
      }

- res (nếu đăng ký thành công trả về values, ngược lại trả về errors)

      {
        "success": boolen,
        "message": string,

        "values": {
              "token": string,
              "staff": obj Staff
          }
        "errors": {tên field: string...}
      }

### Đăng nhập

- Method post
- https://server-api-cinema.herokuapp.com/api/staff/login
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
              "staff": obj staff
              }
        "errors": {tên field: string...}
      }

### Lấy thông tin của nhân viên đăng nhập

- Method GET
- https://server-api-cinema.herokuapp.com/api/staff/me
- Content-Type: application/json
- Authorization: Bearer <token>
- res

      {
        "success": boolean,
        "message": string,
        "values":{
             "staff": obj staff
        }
        "errors": ""
      }

### Lấy thông tin của nhân viên theo id

- Method GET
- https://server-api-cinema.herokuapp.com/api/staff/:id
- Content-Type: application/json
- res

      {
        "success": boolean,
        "message": string,
        "values":{
             "staff": obj staff
        }
        "errors": ""
      }

### Lấy danh sách nhân viên

- Method GET
- https://server-api-cinema.herokuapp.com/api/staff/all
- Content-Type: application/json
- res

      {
        "success": boolean,
        "message": string,
        "values":{
             "staffs": [obj staff]
        }
        "errors": ""
      }

### Sửa nhân viên ( type = 0 và 1 mới có quyền thoa tác )
- Method PUT
- https://server-api-cinema.herokuapp.com/api/staff/update
- Content-Type: application/json
- Authorization: Bearer <token>
- body

      {
          "email":"26112000@gmail.com",
          "phoneNumber":"0983782941",
          "fullName":"Lê Nguyễn Hùng Vỹ",
          "male":true,
          "dateOfBirth":"11/26/2000",
          "permissionId":"6149d3ff52d8c52050d24e3c"
      }

- res

      {
        "success": boolen,
        "message": string,

        "values": {
              "staff": obj Staff
          }
        "errors": ""
      }

### Xóa nhân viên ( type = 0 và 1 mới có quyền thoa tác )

- Method DELETE
- https://server-api-cinema.herokuapp.com/api/staff/delete/:id
- Authorization: Bearer <token>
- res

      {
        "success": boolen,
        "message": string,

        "values": {
              "staff": obj Staff
          }
        "errors": ""
      }
### Đổi mật khẩu
- Method PUT
- https://server-api-cinema.herokuapp.com/api/staff/change-password
- Authorization: Bearer <token>
- body
     
      {
         "oldPassword": "vykt@2000",
         "newPassword": "123456",
         "confirmPassword": "123456"
      }
- res

      {
        "success": boolen,
        "message": string,
        "errors": {fleld....}
      }
## `Cast`

### Modal

     {
        "_id": string,
        "name": string,
        "dateOfBirth": string,
        "image": string,
        "joinDate": string,
        "address": string,
        "email": string,
        "phoneNumber": string,
        "introduce": string,
        "male": booleanm
        "createdAt": string
      }

### Tạo đạo diễn mới

- Method post
- https://server-api-cinema.herokuapp.com/api/cast/add
- body
     
       "name":"Craig Gillespie",
       "dateOfBirth":"9/1/1967",
       "image": "https://www.galaxycine.vn/media/c/r/craig-doc.png",
       "joinDate":"10/10/2015",
       "address":"Sydney, New South Wales, Australia",
       "phoneNumber":"0986521456",
       "email":"craig@gmail.com",
       "introduce":"",
       "male":true
- res

         "success": boolean,
         "message": string,
         "values": {
              "cast": obj cast
         }

### Lấy tất cả đạo diễn

- Method post
- https://server-api-cinema.herokuapp.com/api/cast/all
- res

         "success": boolean,
         "message": string,
         "values": {
              "casts": [obj cast]
         }

### Lấy đạo diễn theo id

- Method post
- https://server-api-cinema.herokuapp.com/api/cast/:id
- res

          "success": boolean,
          "message": string,
          "values": {
               "cast": obj cast
          }

## `Director`

### Modal

     {
        "_id": string,
        "name": string,
        "dateOfBirth": string,
        "image": string,
        "joinDate": string,
        "address": string,
        "email": string,
        "phoneNumber": string,
        "introduce": string,
        "male": booleanm
        "createdAt": string
      }

### Tạo diễn viên mới

- Method post
- https://server-api-cinema.herokuapp.com/api/director/add
- body
  
       "name":"Craig Gillespie",
       "dateOfBirth":"9/1/1967",
       "image": "https://www.galaxycine.vn/media/c/r/craig-doc.png",
       "joinDate":"10/10/2015",
       "address":"Sydney, New South Wales, Australia",
       "phoneNumber":"0986521456",
       "email":"craig@gmail.com",
       "introduce":"",
       "male":true
- res

         "success": boolean,
         "message": string,
         "values": {
              "director": obj director
         }

### Lấy tất cả diễn viên

- Method post
- https://server-api-cinema.herokuapp.com/api/director/all
- res

         "success": boolean,
         "message": string,
         "values": {
              "directors": [obj director]
         }

### Lấy diễn viên theo id

- Method post
- https://server-api-cinema.herokuapp.com/api/director/:id
- res

          "success": boolean,
          "message": string,
          "values": {
               "director": obj director
          }


## `Category`

### Modal

     {
          "_id": string,
          "name": string,
          "image": string,
     }

### Tạo thể loại mới

- Method post
- https://server-api-cinema.herokuapp.com/api/category/add
- body
  "name":"Việt Nam"
- res

         "success": boolean,
         "message": string,
         "values": {
              "category": obj category
         }

### Lấy tất cả thể loại

- Method post
- https://server-api-cinema.herokuapp.com/api/category/all
- res

         "success": boolean,
         "message": string,
         "values": {
              "categories": [obj categories]
         }

### Lấy thể loại theo id

- Method post
- https://server-api-cinema.herokuapp.com/api/category/:id
- res

          "success": boolean,
          "message": string,
          "values": {
               "category": obj category
          }

## `Nation`

### Modal

     {
          "_id": string,
          "name": string,
     }

### Tạo quốc gia mới

- Method post
- https://server-api-cinema.herokuapp.com/api/nation/add
- body
  "name":"Việt Nam"
- res

         "success": boolean,
         "message": string,
         "values": {
              "nation": obj nation
         }

### Lấy tất cả quốc gia

- Method post
- https://server-api-cinema.herokuapp.com/api/nation/all
- res

         "success": boolean,
         "message": string,
         "values": {
              "nations": [obj nations]
         }

### Lấy quốc gia theo id

- Method post
- https://server-api-cinema.herokuapp.com/api/nation/:id
- res

          "success": boolean,
          "message": string,
          "values": {
               "nation": obj nation
          }

## `Movie`

### Modal

     {
          "_id": string,
          "name": String,
          "moveDuration": String,
          "image": String,
          "trailer": String,
          "description": String,
          "nation": obj nation,
          "cast": obj cast
     }

### Tạo phim mới

- Method post
- https://server-api-cinema.herokuapp.com/api/movie/add
- body
     
       "name":"CRUELLA",
       "moveDuration":"120",
       "image":"https://www.galaxycine.vn/media/2021/5/6/1200x1800_1620271790120.jpg",
       "trailer":"https://youtu.be/gmRKv7n2If8",
       "description":"Cruella lấy bối cảnh London thập niên 70, sau cuộc cách mạng văn hóa và âm nhạc. Emma Stone vào vai nhà thiết kế trẻ tuổi Estella – một cô gái trẻ tham  vọng, chịu thương chịu khó nhưng lại bị đánh giá thấp trong nghề. Chẳng cam lòng, cô nàng quyết tâm tạo dựng tên tuổi trong ngành thời trang.",
       "nation":"61421264fcc0d010bc34d3d5" (\_id nation),
       "cast":"614203ba5428a850a873bad2" (\_id cast),
       "screensId":["614ebe7404f1a516b8b5b2bd","614ebe7d04f1a516b8b5b2bf","614ebe8904f1a516b8b5b2c1"] // list mã màng hình
- res

         "success": boolean,
         "message": string,
         "values": {
              "movie": obj movie
         }

### Lấy tất cả phim

- Method post
- https://server-api-cinema.herokuapp.com/api/movie/all
- res

         "success": boolean,
         "message": string,
         "values": {
              "movies": [obj movies]
         }

### Lấy phim theo id

- Method post
- https://server-api-cinema.herokuapp.com/api/movie/:id
- res

          "success": boolean,
          "message": string,
          "values": {
               "movie": obj movie
          }

## `ShowTime`

### Modal

     {
          "_id": string,
          status: Boolean,
          cinema: String,
          screenDetail: String,
     }

### Tạo Lịch chiếu

- Method post
- https://server-api-cinema.herokuapp.com/api/showTime/add
- body
     
          "dateStart":"10/16/2021",
          "dateEnd":"10/20/2021"  // có thể bỏ trống
          "screenDetailId":"61644b3cdf1b9d2700e43b34",
          "cinemaId":"614c03db576b5d00376801a6",
          "showTimes":[
               {"roomId":"61546d3254698823ccb8cbfd","times":["6154593a543dc74d680458ca","6154594e543dc74d680458ce"]},
               {"roomId":"6164461c8f5ac35aecd5616e","times":["6157d524b029ee0037ccbd26"]}
          ]

- res

          "success": true,
          "message": "Thêm lịch chiếu thành công"

          "success": false,
          "errors": {
               "dateStart": "Vui lòng chọn ngày bắt đầu bé hơn ngày kết thúc.",
               "screenDetailId": "Vui lòng chọn phim.",
               "cinemaId": "Vui lòng chọn rạp.",
               "showTimes": "Vui lòng chọn phòng, khung giờ để xếp lịch chiếu"
          }

### Lấy lịch chiếu theo khoảng thời gian

- Method get
- https://server-api-cinema.herokuapp.com/api/showTime/all
-body

          "dateStart":"10/16/2021",
          "dateEnd":"10/13/2021"

- res

          "success": boolean,
          "message": string,
          "showTimes": [
               {
                    "_id": "6164539756461e3668c85741",
                    "date": "10/16/2021",
                    "room": {
                         "_id": "61546d3254698823ccb8cbfd",
                         "name": "A1",
                         "rowNumber": 10,
                         "seatsInRow": 10,
                         "screen": "614ebe7404f1a516b8b5b2bd",
                         "cinema": "614c03db576b5d00376801a6",
                         "__v": 0
                    },
               }
          ]

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

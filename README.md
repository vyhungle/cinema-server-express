# api cinema
Link server [https://server-api-cinema.herokuapp.com/](https://server-api-cinema.herokuapp.com/)\
API location https://thongtindoanhnghiep.co/rest-api




## `Auth`
### Đăng ký (trả về token hoặc Obj errors)

-Method post \
-https://server-api-cinema.herokuapp.com/api/auth/register \
-Content-Type: application/json\
-body\
{\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"email": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"phoneNumber" : string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"confirmPassword": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fullName": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address":{\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"city": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"district": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ward": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"street": string\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dateOfBirth": string (mm/dd/yyy)\
}

### Đăng nhập (trả về token hoặc Obj errors)

-Method post \
-https://server-api-cinema.herokuapp.com/api/auth/login \
-Content-Type: application/json\
-body\
{\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"username": string(email hoặc phoneNumber),\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password" : string,\
}


### Lấy thông tin của user đăng nhập
-Method get \
-https://server-api-cinema.herokuapp.com/api/auth/me \
-Content-Type: application/json\
-Authorization: Bearer <Token khi login hoặc register>\
-res => obj user

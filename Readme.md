# Shopping API

#### Projenin çalıştırılması için gerekenler

Proje dockerize edilmiştir. Projenin çalıştırılma adımları;

- `docker compose build`
- `docker compose up`

yukarıdaki adımları yaptıktan sonra proje veri tabanına bağlanmış ve gerekli **migrationlar** veri tabanına işlenmiş olur.

Projede **admin** kullanıcı oluşturmak için bir **script** yazılmıştır. Yukarıdaki adımlardan sonra `npm run db:create-admin-account` komutunu çalıştırarak sisteme admin kullanıcısını ekleyebilirsiniz.

#### Kullanılan Teknolojiler

Proje **Node.js'in express** kütüphanesi ile geliştirilmiştir. Veri tabanı olarak ilişkisel bir veri tabanı olan **PostgreSQL** kullanılmıştır. ORM olarak ise **Prisma** kullanılımıştır. Geliştirme dili olarak **TypeScript** kullanılmıştır. Loglama yapısı için **pino** tercih edilmiştir. Gelen istekler de şemaların doğrulanması **zod** paketi ile gerçekleştirilmiştir. Test yazımında **Jest** paketi ile testler yazılmıştır.

Projenin geliştirme aşamasındaki standardı korumak için **eslint**, **husky**, **editorconfig**, **prettier** ve **commitlint** gibi yapılandırmalar eklenmiştir.

#### Klasör Yapısı

- prisma
- src
  - controllers
  - services
  - routers
  - middlewares
  - configs
  - interfaces
  - responses
  - utils
  - validations
- test

  <br>

- **prisma** veri tabanı şeması, migrationları, scriptlerini içerir
- **src** projede kullanılan kaynak kodları içerir.
- **controllers** HTTP isteklerini işleyen dosyaları içerir. İstemcilerden gelen istekleri alır, işler ve istemcilere yanıtlar.
- **services** Prisma kullanarak veritabanına bağlanma ve veri ekleme işlemlerini içeren bir bölümdür. Bu klasör, iş mantığını ayırmak ve veritabanı işlemlerini daha düzenli ve okunaklı bir şekilde yönetmek için kullanılır.
- **routers** HTTP isteklerini ilgili controller'a yönlendiren router dosyalarını içerir.Yani, hangi isteğin hangi controller'a gideceğini belirler.
- **middlewares** isteklerin işlenmeden önce geçtiği ara katman (middleware) dosyalarını içerir. Örneğin, kimlik doğrulama, oturum yönetimi veya şema doğrulama gibi işlemleri gerçekleştirebilir.
- **configs** uygulama yapılandırma dosyalarını içerir. Veritabanı bağlantıları, loglama veya diğer konfigürasyon ayarları burada bulunabilir.
- **interfaces** uygulama içinde kullanılan interfaceleri bulundurur.
- **responses** özel hata sınıflarını, istemciye iletilen response yapılarının standartlaşmasını sağlayan dosyaları içerir.
- **utils** farklı bölümlerde tekrar kullanılabilecek kod bloklarının bulunduğu klasördür.
- **validations** kullanıcı girişlerini veya veri doğrulamalarını işleyen dosyaları içerir.
- **test** test dosyalarını içeren klasördür.

projede yapıları birbirinden ayırarak daha okunabilir daha yönetilir bir proje tasarımı oluşturulmuştur.

#### API Yanıtları

Projede istemciye iletilen başarılı ve hatalı durumlardaki yanıtlar belirli bir standart çerçevesinde iletilmektedir.

başarılı response örnekleri

```
{
    "success": true,
    "statusCode": 200,
    "data": {
        "id": 3,
        "name": "Iphonw 14",
        "price": 58500,
        "stock": 8,
        "createdAt": "2023-09-16T10:57:11.027Z",
        "updatedAt": "2023-09-16T10:57:11.027Z"
    }
}
```

```
{
    "success": true,
    "statusCode": 200,
    "data": [
        {
            "id": 1,
            "name": "Mac M1",
            "price": 34500,
            "stock": 4,
            "createdAt": "2023-09-16T09:24:13.953Z",
            "updatedAt": "2023-09-16T09:26:43.657Z"
        },
        {
            "id": 2,
            "name": "Iphone 14",
            "price": 58500,
            "stock": 2,
            "createdAt": "2023-09-16T09:24:45.818Z",
            "updatedAt": "2023-09-16T09:29:42.526Z"
        }
    ]
}
```

hata durumlarındaki response örnekleri

```
{
    "errors": [
        {
            "message": "jwt expired"
        }
    ],
    "success": false,
    "statusCode": 401
}
```

validasyon hataları

```
{
    "errors": [
        {
            "field": "price",
            "code": "invalid_type",
            "message": "Required"
        },
        {
            "field": "stock",
            "code": "invalid_type",
            "message": "Required"
        }
    ],
    "success": false,
    "statusCode": 422
}
```

[**Postman Koleksiyon Linki**](https://documenter.getpostman.com/view/29717269/2s9YC7SBDo)

Projedeki endpointleri aşağıdaki linke giderek postman üzerinden test edebilirsiniz. Postmande endpoint örnekleri ve açıklamaları vardır.

https://documenter.getpostman.com/view/29717269/2s9YC7SBDo

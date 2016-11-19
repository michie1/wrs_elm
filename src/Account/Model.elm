module Account.Model exposing (Login, login)

type alias Login =
    { name : String
    }

login : Login
login =
    { name = "Michiel"
    }

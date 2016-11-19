module Account.Model exposing (Login, login, initial)

import Riders.Model

type alias Login =
    { name : String
    , password : String
    }

login : Login
login =
    { name = ""
    , password = ""
    }

initial : Maybe Riders.Model.Rider
initial =
    Just (Riders.Model.Rider 2 "Henk" "Amateur")

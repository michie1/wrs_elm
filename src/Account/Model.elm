module Account.Model exposing (Login, login, initial, Signup, signup)

import Riders.Model

type alias Login =
    { name : String
    , password : String
    }

type alias Signup =
    { name : String 
    }

login : Login
login =
    { name = ""
    , password = ""
    }

signup : Signup
signup = 
    { name = ""
    }

initial : Maybe Riders.Model.Rider
initial =
    --Just (Riders.Model.Rider 2 "Henk" "Amateur")
    Nothing

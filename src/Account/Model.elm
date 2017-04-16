module Account.Model exposing (Login, login, initial, Signup, signup)

import Rider.Model


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


initial : Maybe Rider.Model.Rider
initial =
    Nothing
    -- Just (Rider.Model.Rider 1 "Michiel" Nothing)

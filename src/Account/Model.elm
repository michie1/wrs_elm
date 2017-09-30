module Account.Model exposing (Login, login, initial, Signup, signup, Account)

import Rider.Model


type alias Login =
    { email : String
    , password : String
    }


type alias Signup =
    { email : String
    }

type alias Account =
    { id: Int
    , email: String
    , name: String
    , licence : Maybe Rider.Model.Licence
    }

login : Login
login =
    { email = ""
    , password = ""
    }


signup : Signup
signup =
    { email = ""
    }

initial : Maybe Account
initial =
    Nothing
    -- Just (Rider.Model.Rider 1 "Michiel" Nothing)

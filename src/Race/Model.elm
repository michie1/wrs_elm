module Race.Model exposing (Add, Race, Category, Category(..) )

import Date
import Ui.Calendar


type Category
    = Classic
    | Criterium
    | Regiocross
    | Other
    | Unknown


type alias Race =
    { key : String
    , name : String
    , date : Date.Date
    , category : Category
    }

type alias Add =
    { name : String
    , category : Category
    , calendar : Ui.Calendar.Model
    }

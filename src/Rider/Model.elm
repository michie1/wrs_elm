module Rider.Model exposing (Rider, Licence, Licence(..), Add)


type Licence
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Other


type alias Rider =
    { key : String
    , name : String
    , licence : Maybe Licence
    }

type alias Add =
    { name: String
    , licence: Maybe Licence
    }

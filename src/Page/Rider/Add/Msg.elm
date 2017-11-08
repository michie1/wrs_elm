module Page.Rider.Add.Msg exposing (Msg, Msg(..))

import Data.Licence exposing (Licence)

type Msg
    = RiderAddSubmit
    | RiderAddLicence Licence
    | RiderAddName String

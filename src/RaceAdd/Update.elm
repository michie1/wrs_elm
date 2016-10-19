module RaceAdd.Update exposing (update)

import RaceAdd.Msg exposing (Msg(..))
import RaceAdd.Model exposing (RaceAdd)
import Material


update : Msg -> RaceAdd -> ( RaceAdd, Cmd Msg )
update msg raceAdd =
    case msg of
        SetName name ->
            ( { raceAdd | name = name }
            , Cmd.none
            )

        Mdl msg' ->
            Material.update msg' raceAdd

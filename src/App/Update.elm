module App.Update exposing (update)

import App.Model exposing (App)
import App.Page exposing (Page(..))
import App.Msg exposing (Msg(..))
import Race.Model exposing (Race)


--import RaceAdd.Update

import Races.Update
import RaceAdd.Model exposing (RaceAdd)
import Material
import Navigation


toHash : Page -> String
toHash page =
    case page of
        Home ->
            "#home"

        Riders ->
            "#riders"

        Races ->
            "#races"

        RaceAddPage ->
            "#race-add"

        RacesDetails id -> 
            "#races/" ++ toString id


setRaceName : Race -> String -> Race
setRaceName race name =
    { race | name = name }
 
setRaceId : Race -> List Race -> Race
setRaceId race races =
    let 
        id = calcRaceId races
    in 
        { race | id = id }

calcRaceId : List Race -> Int
calcRaceId races = 
    ( List.length races ) + 1


clearRaceName : Race -> Race
clearRaceName race =
    setRaceName race ""


setRaceAdd : RaceAdd -> Race -> RaceAdd
setRaceAdd raceAdd race' =
    { raceAdd | race = race' }


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        Add race ->
            ( { app
                | races = (List.append [ (setRaceId race app.races) ] app.races)
                , raceAdd = (setRaceAdd app.raceAdd (clearRaceName app.raceAdd.race))
              }
            , Navigation.newUrl "#races"
            )

        SetName name' ->
            let
                raceAdd =
                    app.raceAdd

                race =
                    raceAdd.race

                race' =
                    { race | name = name' }

                raceAdd' =
                    { raceAdd | race = race' }

                app' =
                    { app | raceAdd = raceAdd' }
            in
                ( app'
                , Cmd.none
                )

        GoTo page ->
            ( app
            , (Navigation.newUrl (toHash page))
            )

        Mdl msg' ->
            Material.update msg' app

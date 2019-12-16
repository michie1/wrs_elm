module App.Routing exposing (Route(..), parseUrl, pathFor)

import App.Page
import Url
import Url.Parser exposing ((</>), Parser, map, oneOf, parse, s, string)


type Route
    = RiderDetails String
    | RiderAdd
    | Riders
    | RaceAdd
    | RaceDetails String
    | Races
    | Results
    | ResultAdd String
    | ResultEdit String


pathFor : App.Page.Page -> String
pathFor page =
    case page of
        App.Page.Riders ->
            "riders"

        App.Page.RiderDetails key ->
            "riders/" ++ key

        App.Page.RiderAdd _ ->
            "riders/add"

        App.Page.Races ->
            "races"

        App.Page.RaceDetails key ->
            "races/" ++ key

        App.Page.RaceAdd _ ->
            "races/add"

        App.Page.ResultAdd add ->
            "races/" ++ add.raceKey ++ "/add"

        App.Page.ResultEdit edit ->
            "results/" ++ edit.resultKey ++ "/edit"


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Races (s "races")
        , map Races (s "")
        , map RiderAdd (s "riders" </> s "add")
        , map RiderDetails (s "riders" </> string)
        , map Riders (s "riders")
        , map ResultAdd (s "races" </> string </> s "add")
        , map ResultEdit (s "results" </> string </> s "edit")
        , map RaceAdd (s "races" </> s "add")
        , map RaceDetails (s "races" </> string)
        , map Races (s "races")
        , map Results (s "results")
        ]


parseUrl : Url.Url -> Route
parseUrl url =
    url
        |> parse matchers
        |> Maybe.withDefault Races

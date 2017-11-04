module App.Routing exposing (Route(..), routeParser, url)

import Navigation
import UrlParser exposing (parseHash, Parser, s, map, string, (</>), oneOf)
import App.Page


type Route
    = RiderDetails String
    | RiderAdd
    | Riders
    | RaceAdd
    | RaceDetails String
    | Races
    | Results
    | ResultAdd String


url : App.Page.Page -> String
url page =
    case page of
        App.Page.Riders ->
            "#riders"

        App.Page.RiderDetails key ->
            "#riders/" ++ key

        App.Page.RiderAdd _ ->
            "#riders/add"

        App.Page.Races ->
            "#races"

        App.Page.RaceDetails key ->
            "#races/" ++ key

        App.Page.RaceAdd _ ->
            "#races/add"

        App.Page.ResultAdd add ->
            "#races/" ++ add.raceKey ++ "/add"

matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Races (s "races")
        , map Races (s "")
        , map RiderAdd (s "riders" </> s "add")
        , map RiderDetails (s "riders" </> string)
        , map Riders (s "riders")
        , map ResultAdd (s "races" </> string </> s "add")
        , map RaceAdd (s "races" </> s "add")
        , map RaceDetails (s "races" </> string)
        , map Races (s "races")
        , map Results (s "results")
        ]


routeParser : Navigation.Location -> Route
routeParser location =
    location
        |> parseHash matchers
        |> Maybe.withDefault Races

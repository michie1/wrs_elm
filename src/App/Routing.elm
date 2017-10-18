module App.Routing exposing (Route(..), url, routeParser)

import Navigation
import UrlParser exposing (..)


type Route
    = Home
    | RiderDetails Int
    | Riders
    | RaceAdd
    | RaceDetails String
    | Races
    | Results
    | ResultAdd String


url : Route -> String
url route =
    case route of
        Home ->
            "#home"

        Riders ->
            "#riders"

        RiderDetails id ->
            "#riders/" ++ toString id

        Races ->
            "#races"

        RaceAdd ->
            "#races/add"

        RaceDetails key ->
            "#races/" ++ key

        Results ->
            "#results"

        ResultAdd key ->
            "#races/" ++ key ++ "/add"

matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Races (s "races")
        , map Races (s "")
        , map RiderDetails (s "riders" </> int)
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
    -- location |> parseHash matchers |> Maybe.withDefault Home

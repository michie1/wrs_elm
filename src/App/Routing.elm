module App.Routing exposing (Route(..), reverse, routeParser)

import Navigation
import UrlParser exposing (..)


reverse : Route -> String
reverse route =
    case route of
        Home ->
            "#home"

        Riders ->
            "#riders"

        RidersAdd ->
            "#riders/add"

        RidersDetails id ->
            "#riders/" ++ toString id

        Races ->
            "#races"

        RacesAdd ->
            "#races/add"

        RacesDetails id ->
            "#races/" ++ toString id

        Results ->
            "#results"

        ResultsAdd id ->
            "#races/" ++ (toString id) ++ "/add"

        CommentAdd id ->
            "#races/" ++ (toString id) ++ "/comment"


type Route
    = Home
    | RidersAdd
    | RidersDetails Int
    | Riders
    | RacesAdd
    | RacesDetails Int
    | Races
    | Results
    | ResultsAdd Int
    | CommentAdd Int

matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Home (s "home")
        , map Home (s "")
        , map RidersAdd (s "riders" </> s "add")
        , map RidersDetails (s "riders" </> int)
        , map Riders (s "riders")
        , map ResultsAdd (s "races" </> int </> s "add")
        , map CommentAdd (s "races" </> int </> s "comment")
        , map RacesAdd (s "races" </> s "add")
        , map RacesDetails (s "races" </> int)
        , map Races (s "races")
        , map Results (s "results")
        ]

routeParser : Navigation.Location -> Route
routeParser location =
  location |> parseHash matchers |> Maybe.withDefault Home



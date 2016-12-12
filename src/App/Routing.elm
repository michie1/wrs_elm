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

        RiderDetails id ->
            "#riders/" ++ toString id

        Races ->
            "#races"

        RaceAdd ->
            "#races/add"

        RaceDetails id ->
            "#races/" ++ toString id

        Results ->
            "#results"

        ResultAdd id ->
            "#races/" ++ (toString id) ++ "/add"

        CommentAdd id ->
            "#races/" ++ (toString id) ++ "/comment"

        AccountLoginName name ->
            "#account/login/" ++ name

        AccountLogin ->
            "#account/login"

        AccountLogout ->
            "#account/logout"

        Account ->
            "#account"

        AccountSignup ->
            "#account/signup"


type Route
    = Home
    | RiderDetails Int
    | Riders
    | RaceAdd
    | RaceDetails Int
    | Races
    | Results
    | ResultAdd Int
    | CommentAdd Int
    | Account
    | AccountLoginName String
    | AccountLogin
    | AccountLogout
    | AccountSignup


matchers : Parser (Route -> a) a
matchers =
    oneOf
        --[ map Home (s "home")
        [ map Races (s "home")
          --, map Home (s "")
        , map Races (s "")
        , map RiderDetails (s "riders" </> int)
        , map Riders (s "riders")
        , map ResultAdd (s "races" </> int </> s "add")
        , map CommentAdd (s "races" </> int </> s "comment")
        , map RaceAdd (s "races" </> s "add")
        , map RaceDetails (s "races" </> int)
        , map Races (s "races")
        , map Results (s "results")
        , map AccountLoginName (s "account" </> s "login" </> string)
        , map AccountLogin (s "account" </> s "login")
        , map AccountLogout (s "account" </> s "logout")
        , map AccountSignup (s "account" </> s "signup")
        , map Account (s "account")
        ]


routeParser : Navigation.Location -> Route
routeParser location =
    location |> parseHash matchers |> Maybe.withDefault Home

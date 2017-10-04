module App.Routing exposing (Route(..), url, routeParser)

import Navigation
import UrlParser exposing (..)


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
    | AccountLoginEmail String
    | AccountLogin
    | AccountSignup
    | StravaCode (String)


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

        RaceDetails id ->
            "#races/" ++ toString id

        Results ->
            "#results"

        ResultAdd id ->
            "#races/" ++ (toString id) ++ "/add"

        CommentAdd id ->
            "#races/" ++ (toString id) ++ "/comment"

        AccountLoginEmail email ->
            "#account/login/" ++ email

        AccountLogin ->
            "#account/login"

        Account ->
            "#account"

        AccountSignup ->
            "#account/signup"

        StravaCode code ->
            "#account/login/strava/code"

matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Races (s "races")
        , map Races (s "")
        , map RiderDetails (s "riders" </> int)
        , map Riders (s "riders")
        , map ResultAdd (s "races" </> int </> s "add")
        , map CommentAdd (s "races" </> int </> s "comment")
        , map RaceAdd (s "races" </> s "add")
        , map RaceDetails (s "races" </> int)
        , map Races (s "races")
        , map Results (s "results")
        , map StravaCode (s "account" </> s "login" </> s "strava" </> string) -- paramString does not work with hash
        , map AccountLoginEmail (s "account" </> s "login" </> string)
        , map AccountLogin (s "account" </> s "login")
        , map AccountSignup (s "account" </> s "signup")
        , map Account (s "account")
        ]


routeParser : Navigation.Location -> Route
routeParser location =
    location 
        |> parseHash matchers 
        |> Maybe.withDefault Races
    -- location |> parseHash matchers |> Maybe.withDefault Home

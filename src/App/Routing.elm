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

        RaceDetails key ->
            "#races/" ++ key

        Results ->
            "#results"

        ResultAdd key ->
            "#races/" ++ key ++ "/add"

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
        , map ResultAdd (s "races" </> string </> s "add")
        , map RaceAdd (s "races" </> s "add")
        , map RaceDetails (s "races" </> string)
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

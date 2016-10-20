module App.Page exposing (Page(..), toHash)

toHash : Page -> String
toHash page =
    case page of
        Home ->
            "#home"

        Riders ->
            "#riders"

        Races ->
            "#races"

        RacesAdd ->
            "#races/add"

        RacesDetails id -> 
            "#races/" ++ toString id
type Page
    = Home
    | Riders
    | RacesAdd
    | RacesDetails Int
    | Races

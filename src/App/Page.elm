module App.Page exposing (Page(..), toHash)

toHash : Page -> String
toHash page =
    case page of
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

        ResultsAdd ->
            "#results/add"
        
type Page
    = Home
    | RidersAdd
    | RidersDetails Int
    | Riders
    | RacesAdd
    | RacesDetails Int
    | Races
    | Results
    | ResultsAdd

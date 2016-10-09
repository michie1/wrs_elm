import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.Attributes exposing (..)
import Html.App as Html
import Html.Events exposing (onClick)
import Html.Events exposing (onInput)
import Focus exposing (..)
import Array exposing (Array, fromList, get)

main =
  Html.beginnerProgram
    { model = model
    , view = view
    , update = update
    }

-- MODEL

type alias Race =
  { name: String
  }

type alias Rider = 
  { name : String
  , licence : String
  }

type alias Model = 
  { counter : Int
  , bla : String
  , rider : Rider
  , races : Array Race
  }


model : Model
model =
  Model 
    1 
    "foo"
    (Rider "Michiel" "Elite") 
    (fromList [ 
      Race "race a" 
    , Race "race b" 
    ])

-- UPDATE


type Msg
  = Increment
  | Decrement
  | Change
  | Add

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
        { model | counter = model.counter + 1 }

    Decrement ->
        { model | counter = model.counter - 1 }

    Change -> 
        { model | bla = toString model.counter }

    Add -> 
        { model | races = Array.push (Race "race c") model.races}



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model.counter) ]
    , button [ onClick Increment ] [ text "+" ]
    , div [] 
      [ button [ onClick Change ] [ text model.bla ]
      , button [ onClick Add ] [ text "Add race c"]
      , div [] [ text (toString model.races) ]
      , div [] [ printMaybeRaceName (Array.get 0 model.races) ]
      , div [] [ showRaceNames model.races ]
      ]
    , viewRider model
    ]

viewRider : Model -> Html msg
viewRider model =
  div [ ] [ 
    div [] [ text "Naam: " ]
  , div [] [ text model.rider.name ]
  , div [] [ text "Licentie: " ]
  , div [] [ text model.rider.licence ]
  ]

printRaceName : Race -> Html msg
printRaceName race =
  li [] [ text race.name ]

printMaybeRaceName : Maybe Race -> Html msg
printMaybeRaceName maybeRace =
  case maybeRace of
    Just race -> 
      printRaceName race

    Nothing ->
      div [] [ text "No race" ]

showRaceNames : Array Race -> Html msg
showRaceNames races =
  ul [] (Array.toList (Array.map printRaceName races))

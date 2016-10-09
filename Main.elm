import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.Attributes exposing (..)
import Html.App as Html
import Html.Events exposing (onClick)
import Html.Events exposing (onInput)
import Focus exposing (..)
import Array exposing (Array, fromList, get)

import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Table as Table

main =
  Html.program
    { init = ( model, Cmd.none ) 
    , view = view
    , subscriptions = always Sub.none 
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
  , mdl : Material.Model
  }


model : Model
model =
  Model 
    1 
    "foo"
    (Rider "Michiel" "Elite") 
    (fromList [ Race "race a", Race "race b" ])
    Material.model

-- UPDATE

type Msg
  = Increment
  | Decrement
  | Change
  | Add
  | Mdl (Material.Msg Msg)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Increment ->
      ( { model | counter = model.counter + 1 }
      , Cmd.none
      )

    Decrement ->
      ( { model | counter = model.counter - 1 }
      , Cmd.none
      )

    Change -> 
      ( { model | bla = toString model.counter }
      , Cmd.none
      )

    Add -> 
      ( { model | races = Array.push (Race "race c") model.races}
      , Cmd.none
      )

    Mdl msg' -> 
      Material.update msg' model



-- VIEW

type alias Mdl = 
  Material.Model 

view : Model -> Html Msg
view model =
  div []
    [ Options.styled Html.p [ Typo.display3 ] [text "WRS"]
    , button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model.counter) ]
    , button [ onClick Increment ] [ text "+" ]
    , Button.render Mdl [0] model.mdl 
      [ Button.onClick Increment 
      , css "margin" "0 24px"
      ]
      [ text "Increase" ]
    , div [] 
      [ button [ onClick Change ] [ text model.bla ]
      , button [ onClick Add ] [ text "Add race c"]
      , div [] [ text (toString model.races) ]
      , div [] [ printMaybeRaceName (Array.get 0 model.races) ]
      , div [] [ showRaceNames model.races ]
      ]
    , Table.table []
      [ Table.thead []
        [ Table.tr []
          [ Table.th [] [ text "Naam" ]
          , Table.th [ ] [ text "Quantity" ]
          , Table.th [ ] [ text "Unit Price" ]
          ]
        ]
      , Table.tbody []
          (Array.toList model.races |> List.map (\item ->
             Table.tr []
               [ Table.td [] [ text item.name ]
               , Table.td [ Table.numeric ] [ text item.name ]
               , Table.td [ Table.numeric ] [ text item.name ]
               ]
             )
          )
      ]
    , viewRider model
    ]
  |> Material.Scheme.top

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

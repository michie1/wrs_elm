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
import Material.Chip as Chip

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
  , rider : Rider
  , races : Array Race
  , mdl : Material.Model
  }


model : Model
model =
  Model 
    1
    (Rider "Michiel" "Elite") 
    (fromList [ Race "race a", Race "race b" ])
    Material.model

-- UPDATE

type Msg
  = Increment
  | Decrement
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
    , Chip.span []
      [ Chip.content []
        [ text (toString model.counter) ]
      ]
    , Button.render Mdl [0] model.mdl 
      [ Button.raised, Button.onClick Increment ]
      [ text "Increase" ]
    , Button.render Mdl [0] model.mdl 
      [ Button.raised, Button.onClick Decrement ]
      [ text "Decrement" ]
    , div [] 
      [ button [ onClick Add ] [ text "Add race c"]
      ]
    , raceTable model.races
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

raceTable : Array Race -> Html msg
raceTable races = 
  Table.table []
    [ Table.thead []
      [ Table.tr [] 
        [ Table.th [] [ text "Naam" ]
        , Table.th [] [ text "Datum" ]
        , Table.th [] [ text "Soort" ]
        , Table.th [] [ text "Aantal WTOS-renners" ]
        ]
      ]
    , Table.tbody []
      [ case (Array.isEmpty races) of
          True -> 
            Table.tr []
              [ Table.td [] [ text "Geen race" ]
              ]

          False -> 
            Table.tr []
              (Array.toList races |> 
                List.map (\item ->
                  Table.tr []
                    [ Table.td [] [ text item.name ] ]
                )
              )
          
      ]
    ]

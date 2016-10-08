import Html exposing (Html, button, div, text, span, input)
import Html.Attributes exposing (..)
import Html.App as Html
import Html.Events exposing (onClick)
import Html.Events exposing (onInput)
import Focus exposing (..)

main =
  Html.beginnerProgram
    { model = model
    , view = view
    , update = update
    }

-- MODEL

type alias Rider = 
  { name : String
  , licence: String
  }

type alias Model = 
  { counter : Int
  , bla : String
  , rider : Rider
  }


model : Model
model =
  Model 1 "foo" (Rider "Michiel" "Elite")

-- UPDATE


type Msg
  = Increment
  | Decrement
  | Change
  | SetName String


update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
        { model | counter = model.counter + 1 }

    Decrement ->
        { model | counter = model.counter - 1 }

    Change -> 
        { model | bla = toString model.counter }

    SetName name -> 
        -- { model | rider = { name | name } }
        Focus.set (bla) name model

bla : Focus Rider String
bla = 
  Focus.create 
    .bla 
    (\f rider -> { rider | bla = f rider.bla }) 

-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model.counter) ]
    , button [ onClick Increment ] [ text "+" ]
    , div [] 
      [ button [ onClick Change ] [ text model.bla ]
      ]
    , div [] [ input [ type' "text", placeholder "Bla", onInput SetName ] [ ] ]
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


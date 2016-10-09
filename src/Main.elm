import Html exposing (Html, button, div, text, span, input, ul, li)
import Dict exposing (Dict)
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

import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import String

main =
  Navigation.program (Navigation.makeParser hashParser)
    --{ init = ( model, Cmd.none ) 
    { init = init
    , view = view
    , update = update
    , urlUpdate = urlUpdate
    , subscriptions = always Sub.none 
    }

-- URL PARSERS - check out evancz/url-parser for fancier URL parsing

toHash : Page -> String
toHash page =
  case page of
    Home ->
      "#home"

    Riders ->
      "#riders"

hashParser : Navigation.Location -> Result String Page
hashParser location =
  UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)

type Page = Home | Riders


pageParser : Parser (Page -> a) a
pageParser =
  oneOf
    [ format Home (s "home")
    , format Riders (s "riders")
    ]

-- MODEL

type alias Race =
  { name: String
  }

type alias Rider = 
  { name : String
  , licence : String
  }

type alias Model = 
  { page : Page
  , query : String
  , cache : Dict String (List String)
  , counter : Int
  , rider : Rider
  , races : Array Race
  , mdl : Material.Model
  }


model : Model
model =
  Model 
    Home
    ""
    Dict.empty
    1
    (Rider "Michiel" "Elite") 
    (fromList [ Race "race a", Race "race b" ])
    Material.model

init : Result String Page -> (Model, Cmd Msg)
init result =
  urlUpdate result model

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
      { model | counter = model.counter + 1, page = Home }
        ! [ Navigation.newUrl ( toHash Home ) ]
     

    Decrement ->
      ( { model | counter = model.counter - 1, page = Riders }
      , Navigation.newUrl ( toHash Riders )
      )

    Add -> 
      ( { model | races = Array.push (Race "race c") model.races}
      , Cmd.none
      )

    Mdl msg' -> 
      Material.update msg' model

urlUpdate : Result String Page -> Model -> (Model, Cmd Msg)
urlUpdate result model =
  case result of 
    Ok page ->
      { model
        | page = page
        , query = ""
      }
        ! []
             
    Err _ ->
      (model, Navigation.modifyUrl (toHash model.page))


-- VIEW

type alias Mdl = 
  Material.Model 

view : Model -> Html Msg
view model =
  div []
    [ Options.styled Html.p [ Typo.display3 ] [text "WRS"]
    , div [] (viewPage model)
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
    , raceTable (Array.toList model.races)
    , viewRider model
    ]
  |> Material.Scheme.top


viewPage : Model -> List (Html msg)
viewPage model = 
  case model.page of
    Home ->
      [ Options.styled Html.p [ Typo.display2 ] [text "HOME"]
      ]
      
    Riders ->
      [ Options.styled Html.p [ Typo.display2 ] [text "RIDERS"]
      ]

viewRider : Model -> Html msg
viewRider model =
  div [ ] [ 
    div [] [ text "Naam: " ]
  , div [] [ text model.rider.name ]
  , div [] [ text "Licentie: " ]
  , div [] [ text model.rider.licence ]
  ]

raceTable : List Race -> Html msg
raceTable races = 
  Table.table []
    [ Table.thead []
      [ Table.tr [] 
        [ Table.th [] [ text "Naam" ]
        , Table.th [] [ text "Datum" ]
        , Table.th [] [ text "Soort" ]
        , Table.th [] [ text "WTOS-renners" ]
        ]
      ]
    , Table.tbody []
      (races |> List.map (\race ->
          Table.tr []
            [ Table.td [] [ text race.name ] 
            , Table.td [] [ text race.name ] 
            , Table.td [] [ text race.name ] 
            , Table.td [ Table.numeric ] [ text race.name ] 
            ]
        ) 
      )
    ]



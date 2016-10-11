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
import Material.Layout as Layout

import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import String

import Types exposing (Model, Race, Rider)
import ViewRaces exposing (viewRaces)

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

toHash : Types.Page -> String
toHash page =
  case page of
    Types.Home ->
      "#home"

    Types.Riders ->
      "#riders"
    
    Types.Races ->
      "#races"


hashParser : Navigation.Location -> Result String Types.Page
hashParser location =
  UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)




pageParser : Parser (Types.Page -> a) a
pageParser =
  oneOf
    [ format Types.Home (s "home")
    , format Types.Riders (s "riders")
    , format Types.Races (s "races")
    ]

-- MODEL


model : Model
model =
  Model 
    Types.Home
    ""
    Dict.empty
    1
    (Rider "Michiel" "Elite") 
    (fromList [ Race "race a", Race "race b" ])
    Material.model

init : Result String Types.Page -> (Model, Cmd Msg)
init result =
  urlUpdate result model

-- UPDATE

type Msg
  = Increment
  | GoToRiders
  | Add
  | GoToRaces
  | Mdl (Material.Msg Msg)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Increment ->
      { model | counter = model.counter + 1, page = Types.Home }
        ! [ Navigation.newUrl ( toHash Types.Home ) ]
     

    GoToRiders ->
      ( 
        { model | page = Types.Riders }
      , Navigation.newUrl ( toHash Types.Riders )
      )

    Add -> 
      ( { model | races = Array.push (Race "race c") model.races}
      , Cmd.none
      )
      
    GoToRaces ->
      ( { model | page = Types.Races }
      , Navigation.newUrl ( toHash Types.Races )
      )

    Mdl msg' -> 
      Material.update msg' model

urlUpdate : Result String Types.Page -> Model -> (Model, Cmd Msg)
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
    [ Layout.render Mdl model.mdl [ Layout.fixedHeader ]
      { header = [
        Layout.row []
          [ Layout.title [] 
              [ Layout.link
                  [ Layout.href "#home" ]
                  [ text "WRS" ]
              ]
          , Layout.navigation []
            [ Layout.link
                [ Layout.href "#races" ]
                [ text "Races" ]
            , Layout.link
                [ Layout.href "#riders" ]
                [ text "Riders" ]
            ]
          ]
        ]
      , drawer = []
      , tabs = ([], [])
      , main = [ mainView model ]
      }
    ]
  |> Material.Scheme.top

mainView : Model -> Html Msg
mainView model =
  div [] [ viewPage model ]

viewPage : Model -> Html msg
viewPage model = 
  case model.page of
    Types.Home ->
       Options.styled Html.p [ Typo.display2 ] [text "HOME"]
      
      
    Types.Riders ->
       Options.styled Html.p [ Typo.display2 ] [text "RIDERS"]
      
    
    Types.Races ->
      viewRaces model.races

viewRider : Model -> Html msg
viewRider model =
  div [ ] [ 
    div [] [ text "Naam: " ]
  , div [] [ text model.rider.name ]
  , div [] [ text "Licentie: " ]
  , div [] [ text model.rider.licence ]
  ]



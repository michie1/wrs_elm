module Comments.Add exposing (render)

import Html exposing (Html, text, div)
import Html.Attributes
import Html.Events

import Json.Decode as Json

import App.Msg
import App.Model exposing (Mdl)

import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)

import Races.Model
import Riders.Model exposing (Rider)

import Comments.Model

render : Comments.Model.Add -> Races.Model.Race -> List Rider -> Mdl -> Html App.Msg.Msg
render add race riders mdl =
    div []
        [ heading ("Comment on " ++ race.name)
        , div [] 
            [ Textfield.render App.Msg.Mdl
                [ 0 ]
                mdl
                [ Textfield.label "Text"
                , Textfield.floatingLabel
                , Textfield.text'
                , Textfield.onInput App.Msg.CommentAddSetText
                ]
            ]
        , selectRider add.riderIndex riders mdl
        , addButton mdl
        ]

heading : String -> Html App.Msg.Msg
heading headingText =
    Options.styled 
        Html.p
        [ Typo.display2 ]
        [ text headingText ]

addButton : Mdl -> Html App.Msg.Msg
addButton mdl =
    Button.render App.Msg.Mdl
        [ 0 ]
        mdl
        [ Button.raised
        , Button.onClick (App.Msg.CommentAdd)
        ]
        [ text "Add" ]

selectRider : Int -> List Riders.Model.Rider -> Mdl -> Html App.Msg.Msg
selectRider selectedIndex riders mdl =
    div []
        [ Html.select 
            [ onSelect App.Msg.CommentAddSetRiderIndex ]
            ( List.map 
                (\(index, rider) ->
                    ( Html.option 
                        [ (Html.Attributes.value (toString rider.id)), (Html.Attributes.selected (index == selectedIndex)) ] 
                        [ text rider.name ]
                    )
                )
                (List.indexedMap (,) riders)
            )
            
        ]

targetSelectedIndex : Json.Decoder Int
targetSelectedIndex =
    Json.at [ "target", "selectedIndex" ] Json.int

onSelect : (Int -> msg) -> Html.Attribute msg
onSelect msg =
    Html.Events.on "change" (Json.map msg targetSelectedIndex)

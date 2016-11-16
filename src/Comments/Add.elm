module Comments.Add exposing (render)

import Html exposing (Html, text, div, h2, button, i)
import Html.Attributes exposing (class, type_, class)
import Html.Events exposing (onClick)
import Json.Decode as Json
import App.Msg
import App.Model --exposing (Mdl)
--import Material.Button as Button
--import Material.Textfield as Textfield
--import Material.Typography as Typo
--import Material.Options as Options exposing (css)
import Races.Model
import Riders.Model exposing (Rider)
import Comments.Model


render : Comments.Model.Add -> Races.Model.Race -> List Rider -> Html App.Msg.Msg
render add race riders =
    div []
        [ h2 [] [ text ("Comment on " ++ race.name) ]

        {-- , div []
            [ Textfield.render App.Msg.Mdl
                [ 0 ]
                mdl
                [ Textfield.label "Text"
                , Textfield.floatingLabel
                , Textfield.text_
                , Textfield.onInput App.Msg.CommentAddSetText
                ]
            ]
        --}
        , selectRider add.riderIndex riders
        , addButton
        ]

addButton : Html App.Msg.Msg
addButton =
     button
        [ class "waves-effect waves-light btn"
        , type_ "submit"
        , onClick (App.Msg.CommentAdd)
        , Html.Attributes.name "action"
        --, disabled submitDisabled
        ]
        [ text "Add comment"
        , i [ class "material-icons right" ] [ text "send" ]
        ]


selectRider : Int -> List Riders.Model.Rider -> Html App.Msg.Msg
selectRider selectedIndex riders =
    div [] 
        []
        {--
        [ Html.select
            [ onSelect App.Msg.CommentAddSetRiderIndex ]
            (List.map
                (\( index, rider ) ->
                    (Html.option
                        [ (Html.Attributes.value (toString rider.id)), (Html.Attributes.selected (index == selectedIndex)) ]
                        [ text rider.name ]
                    )
                )
                (List.indexedMap (,) riders)
            )
        ]
        --}


targetSelectedIndex : Json.Decoder Int
targetSelectedIndex =
    Json.at [ "target", "selectedIndex" ] Json.int


onSelect : (Int -> msg) -> Html.Attribute msg
onSelect msg =
    Html.Events.on "change" (Json.map msg targetSelectedIndex)

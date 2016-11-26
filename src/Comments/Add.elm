module Comments.Add exposing (render)

import Html exposing (Html, p, br, a, span, li, ul, textarea, text, div, h2, button, i, input, label)
import Html.Attributes exposing (href, autofocus, value, class, type_, id, for, class, disabled)
import Html.Events exposing (onClick, onInput)
import Json.Decode as Json
import App.Msg


--import App.Model --exposing (Mdl)
--import Material.Button as Button
--import Material.Textfield as Textfield
--import Material.Typography as Typo
--import Material.Options as Options exposing (css)

import App.Model
import Races.Model
import Riders.Model exposing (Rider)
import Comments.Model


render : App.Model.App -> Races.Model.Race -> List Rider -> Html App.Msg.Msg
render app race riders =
    case app.account of
        Nothing ->
            div [] [ text "Who are you? Please login first." ]

        Just account ->
            case app.commentAdd of
                Nothing ->
                    div [] [ text "commentAdd nothing" ]

                Just commentAdd ->
                    let
                        submitDisabled =
                            commentAdd.text == ""
                    in
                        div []
                            [ h2 [] [ text ("Comment on " ++ race.name) ]
                            , div []
                                [ ul [ class "collection" ] [
                                       li [ class "collection-item avatar" ]
                                            [ i [ class "material-icons circle red" ] [ text "perm_identity" ]
                                            , span [ class "title" ]
                                                [ a [ href ("#riders/" ++ (toString account.id)) ]
                                                    [ text account.name ]
                                                ]
                                            , p []
                                                    [ textarea
                                                        [ id "text"
                                                        , value commentAdd.text
                                                        , class " materialize-textarea"
                                                        , onInput App.Msg.CommentAddSetText
                                                        , autofocus True
                                                        ]
                                                        []
                                                    , label [ for "text" ] [ text "Comment" ]
                                                    ]
                                            ]
                                        ]
                                ]
                              --, selectRider add.riderIndex riders
                            , addButton submitDisabled
                            ]


addButton : Bool -> Html App.Msg.Msg
addButton submitDisabled =
    button
        [ class "waves-effect waves-light btn"
        , type_ "submit"
        , onClick (App.Msg.CommentAdd)
        , Html.Attributes.name "action"
        , disabled submitDisabled
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
